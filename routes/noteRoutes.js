import express from 'express'
import {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote
} from '../controllers/notesController.js'

import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// Apply JWT verification to all routes in this router
router.use(verifyJWT)

// Define routes
router.route('/')
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote)

export default router

