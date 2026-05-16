import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        default: "Regular Checkup",
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
