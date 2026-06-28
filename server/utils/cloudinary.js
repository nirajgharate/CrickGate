import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary with env credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'crickslot/turfs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
        public_id: `turf_${Date.now()}_${Math.round(Math.random() * 1e6)}`
    })
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Tournament banner storage (separate folder)
const tournamentStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'crickslot/tournaments',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1600, height: 900, crop: 'limit', quality: 'auto' }],
        public_id: `tournament_${Date.now()}_${Math.round(Math.random() * 1e6)}`
    })
});

export const uploadTournament = multer({
    storage: tournamentStorage,
    limits: { fileSize: 8 * 1024 * 1024 }
});

// Profile/logo storage
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'crickslot/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
        public_id: `logo_${Date.now()}_${Math.round(Math.random() * 1e6)}`
    })
});

export const uploadLogo = multer({
    storage: logoStorage,
    limits: { fileSize: 3 * 1024 * 1024 }
});

// Direct base64 upload helper (for cases where we get base64 from frontend)
export const uploadBase64ToCloudinary = async (base64String, folder = 'crickslot/turfs') => {
    const result = await cloudinary.uploader.upload(base64String, {
        folder,
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
    });
    return result.secure_url;
};

export { cloudinary };
