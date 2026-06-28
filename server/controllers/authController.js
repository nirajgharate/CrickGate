import User from "../models/user.js";   
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
        const { name, email, password , confirmPassword, role } = req.body;

        if (!name || !email || !password || !confirmPassword){
            return res.status(404).json({success:false, message: "Fields are missing"});
        }

        if(password !== confirmPassword){
            return res.status(400).json({success:false, message: "Passwords are not same"});
        }

        const existingIser = await User.findOne({ email: email.toLowerCase() })

        if (existingIser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'player'
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    
};

export const Login = async (req, res) => {

        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            message: "Login successful!",
            token,
            user
        });
    
};     