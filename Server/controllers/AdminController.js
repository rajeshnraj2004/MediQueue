import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/AdminModel.js";

const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin in DB
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({ success: true, token });

    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export default AdminLogin;