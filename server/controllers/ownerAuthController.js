import Owner from "../models/owner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ─── OWNER SIGNUP ─────────────────────────────────────────────────────────────
export const OwnerSignup = async (req, res) => {
    const { name, email, password, confirmPassword, phone, businessName } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existing = await Owner.findOne({ email: email.toLowerCase() });
    if (existing) {
        return res.status(409).json({ success: false, message: "An owner account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const owner = new Owner({
        name,
        email,
        password: hashedPassword,
        phone:        phone        || '',
        businessName: businessName || `${name} Sports`,
        role: 'owner',
        isVerified: false
    });

    await owner.save();

    const token = jwt.sign(
        { ownerId: owner._id, role: 'owner' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(201).json({
        success: true,
        message: "Owner account created successfully!",
        token,
        owner: {
            _id:          owner._id,
            name:         owner.name,
            email:        owner.email,
            businessName: owner.businessName,
            phone:        owner.phone,
            role:         owner.role,
            isVerified:   owner.isVerified
        }
    });
};

// ─── OWNER LOGIN ──────────────────────────────────────────────────────────────
export const OwnerLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const owner = await Owner.findOne({ email: email.toLowerCase() });
    if (!owner) {
        return res.status(401).json({ success: false, message: "Owner account not found. Please register first." });
    }

    const valid = await bcrypt.compare(password, owner.password);
    if (!valid) {
        return res.status(400).json({ success: false, message: "Invalid credentials. Check your password." });
    }

    const token = jwt.sign(
        { ownerId: owner._id, role: 'owner' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(200).json({
        success: true,
        message: "Owner login successful!",
        token,
        owner: {
            _id:          owner._id,
            name:         owner.name,
            email:        owner.email,
            businessName: owner.businessName,
            phone:        owner.phone,
            role:         owner.role,
            isVerified:   owner.isVerified
        }
    });
};
