import User from "../models/user.js";

export const FetchUser = async (req, res) => {
    // Fallback to req.userId from verified token if query id is not present
    const id = req.query.id || req.userId;

    if (!id) {
        return res.status(400).json({ success: false, message: "User ID parameter is missing" })
    }

    const user = await User.findOne({ _id: id })

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({ success: true, message: "User found", user })
};

export const EditUser = async (req, res) => {
    const { formData } = req.body;

    if (!formData) {
        return res.status(400).json({ success: false, message: "Update parameters are missing" })
    }

    const targetUserId = formData.userid || req.userId;

    // Enforce matching identity - users can only update their own record
    if (targetUserId !== req.userId) {
        return res.status(403).json({ success: false, message: "Forbidden: You are only allowed to edit your own profile" })
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { $set: formData },
        { new: true }
    )

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User profile not found" })
    }

    return res.status(201).json({
        success: true,
        message: "User updated successfully",
        newUser: updatedUser
    });
}