import express from 'express';
import { getModules, createModule, deleteModule, toggleModuleCompletion } from '../controllers/moduleController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(protect, getModules)
  .post(protect, restrictTo('admin'), upload.array('assets', 5), createModule);

router.route('/:id')
  .delete(protect, restrictTo('admin'), deleteModule);

router.post('/:id/complete', protect, toggleModuleCompletion);

export default router;
