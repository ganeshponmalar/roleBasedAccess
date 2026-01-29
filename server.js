// server.js
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import passport from 'passport'

import connectDB from './config/dbConn.js'
import corsOptions from './config/corsOptions.js'

import './config/passport.js' // 💡 important: this must come after dotenv

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3500

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize()) // ✅ required for Google OAuth

// Routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/notes', noteRoutes)

// Start server after DB connection
mongoose.connection.once('open', () => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})
