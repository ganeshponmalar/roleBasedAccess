import express from 'express'
import passport from 'passport'
import { login, refresh, logout } from '../controllers/authController.js'
import { handleOAuthSuccess } from '../controllers/oauthController.js'

const router = express.Router()

// Traditional login
router.post('/', login)
router.get('/refresh', refresh)
router.post('/logout', logout)

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  handleOAuthSuccess
)

export default router

