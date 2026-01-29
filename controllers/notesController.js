import Note from '../models/Note.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc Get all notes 
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    console.log(notes)

    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }

    const notesWithUser = await Promise.all(    //for each notes fetch notes with username
        notes.map(async (note) => {
            const user = await User.findById(note.user).lean().exec();
            console.log(user, 'from the user')
            return { ...note, username: user?.username || 'Unknown' };
        })
    );

    res.json(notesWithUser);
});



// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;
    console.log(req.body)

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    const note = await Note.create({ user, title, text });

    if (note) {
        return res.status(201).json({ message: 'New note created' });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, _id, user, title, text, completed } = req.body;
    const noteId = id || _id;

    if (!noteId || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const note = await Note.findById(noteId).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const duplicate = await Note.findOne({ title }).lean().exec();//help in sending plain javascript object to avoid mongoose document

    if (duplicate && duplicate._id.toString() !== noteId) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();
    res.json({ message: `'${updatedNote.title}' updated successfully` });
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id, _id } = req.body;
    const noteId = id || _id;

    if (!noteId) {
        return res.status(400).json({ message: 'Note ID required' });
    }

    const note = await Note.findById(noteId).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const result = await note.deleteOne();
    const reply = `Note '${result.title}' with ID ${result._id} deleted`;

    res.json({ message: reply });
});

export {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
};
