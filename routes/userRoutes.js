// routes/userRoutes.js
import express from 'express';
const router = express.Router();

import usersController from '../controllers/usersController.js';

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

export default router;

