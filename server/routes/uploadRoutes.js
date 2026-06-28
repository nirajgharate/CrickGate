import express from 'express';
import wrapAsync from '../wrapAsync.js';
import { UploadTurfImages, UploadSingleImage, DeleteCloudinaryImage } from '../controllers/uploadController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// All upload routes require authentication
// POST /upload/turf-images  — upload array of base64 turf photos
router.post('/turf-images', authMiddleware, wrapAsync(UploadTurfImages));

// POST /upload/single       — upload a single base64 image (logo, banner)
router.post('/single', authMiddleware, wrapAsync(UploadSingleImage));

// DELETE /upload/delete     — delete a Cloudinary asset by publicId
router.delete('/delete', authMiddleware, wrapAsync(DeleteCloudinaryImage));

export default router;
