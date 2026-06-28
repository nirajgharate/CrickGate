import { uploadBase64ToCloudinary, cloudinary } from '../utils/cloudinary.js';

// Upload multiple images (base64 array from frontend)
export const UploadTurfImages = async (req, res) => {
    const { images, folder } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ success: false, message: 'No images provided' });
    }

    if (images.length > 10) {
        return res.status(400).json({ success: false, message: 'Maximum 10 images allowed per turf' });
    }

    const uploadedUrls = [];
    const uploadFolder = folder || 'crickslot/turfs';

    for (const base64 of images) {
        if (!base64 || typeof base64 !== 'string') continue;
        const url = await uploadBase64ToCloudinary(base64, uploadFolder);
        uploadedUrls.push(url);
    }

    res.status(200).json({
        success: true,
        message: `${uploadedUrls.length} image(s) uploaded successfully`,
        urls: uploadedUrls
    });
};

// Upload a single image (base64)
export const UploadSingleImage = async (req, res) => {
    const { image, folder } = req.body;

    if (!image || typeof image !== 'string') {
        return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const uploadFolder = folder || 'crickslot/general';
    const url = await uploadBase64ToCloudinary(image, uploadFolder);

    res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        url
    });
};

// Delete an image from Cloudinary by public_id
export const DeleteCloudinaryImage = async (req, res) => {
    const { publicId } = req.body;

    if (!publicId) {
        return res.status(400).json({ success: false, message: 'publicId is required' });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
};
