import api from "../api/api";

/**
 * Upload multiple base64 turf photos to Cloudinary via backend
 * @param {string[]} base64Array - Array of base64 encoded image strings
 * @returns {Promise<string[]>} - Array of Cloudinary secure URLs
 */
export const UploadTurfImagesService = async (base64Array) => {
    const res = await api.post("/upload/turf-images", {
        images: base64Array,
        folder: "crickslot/turfs"
    });
    return res.data; // { success, urls: [...] }
};

/**
 * Upload a single base64 image (for tournament banner, logo, etc.)
 * @param {string} base64 - Base64 encoded image string
 * @param {string} folder - Cloudinary target folder
 * @returns {Promise<string>} - Cloudinary secure URL
 */
export const UploadSingleImageService = async (base64, folder = "crickslot/general") => {
    const res = await api.post("/upload/single", { image: base64, folder });
    return res.data; // { success, url }
};

/**
 * Delete an image from Cloudinary by its public_id
 * @param {string} publicId - Cloudinary public_id of the image
 */
export const DeleteCloudinaryImageService = async (publicId) => {
    const res = await api.delete("/upload/delete", { data: { publicId } });
    return res.data;
};
