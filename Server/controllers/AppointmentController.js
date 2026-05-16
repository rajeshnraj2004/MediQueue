import Appointment from "../models/AppointmentModel.js";

export const bookAppointment = async (req, res) => {
    try {
        const { clerkId, patientName, date, time, reason } = req.body;
        const appointment = await Appointment.create({
            clerkId,
            patientName,
            date,
            time,
            reason
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPatientAppointments = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const appointments = await Appointment.find({ clerkId }).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
