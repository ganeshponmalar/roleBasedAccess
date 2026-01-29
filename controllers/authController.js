// controllers/authController.js
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

// @desc    Login a user
// @route   POST /auth
export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }


    // Create tokens
    const accessToken = jwt.sign(
        { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )


    const refreshToken = jwt.sign( 
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    


    res.json({ accessToken })
})



// @desc    Refresh access token
// @route   GET /auth/refresh
export const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    console.log(cookies, 'from cookie')

    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const refreshToken = cookies.jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => { //automatically send a refresh token in the cokies 
        if (err) return res.status(403).json({ message: 'Forbidden' })    //with request allowing the server to issue a new access token
                                                                            // with out allowing the user login in again
        const foundUser = await User.findOne({ username: decoded.username }).exec()
        console.log(foundUser,'finding the user')
        
        if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

        const accessToken = jwt.sign(
            { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        res.json({ accessToken })
    })
})

// @desc    Logout user
// @route   POST /auth/logout
export const logout = (req, res) => {

    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(204)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

    res.json({ message: 'Cookie cleared' })
}


