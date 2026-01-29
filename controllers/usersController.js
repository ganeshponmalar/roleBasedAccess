// controllers/usersController.js
import User from "../models/User.js";
import Note from "../models/Note.js";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    console.log(users,'iam from the user')
    
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
});



const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }


    const hashedPwd = await bcrypt.hash(password, 10);
    const userObject = { username, password: hashedPwd, roles };

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});




const updateUser = asyncHandler(async (req, res) => {
    const { id, _id, username, roles, active, password } = req.body;

    const userId = id || _id; // Support either 'id' or '_id'

    // Confirm data 
    if (!userId || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // Does the user exist to update?
    const user = await User.findById(userId).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate && duplicate?._id.toString() !== userId) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});



const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();
    res.json({ message: `Username ${result.username} with ID ${result._id} deleted` });
});

const usersController = { 
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};

export default usersController;
