import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import ConnectDB from './config/Database.js';
import adminRoutes from './routes/adminRoutes.js';
import Admin from './models/AdminModel.js';

dotenv.config();

const app = express()

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);

// Seed admin into DB if not already present
const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.create({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
            });
            console.log("Admin seeded into database successfully");
        } else {
            console.log("Admin already exists in database");
        }
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await ConnectDB();
    await seedAdmin();
});
