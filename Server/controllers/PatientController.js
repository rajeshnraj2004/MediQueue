import Patient from "../models/PatientModel.js";

export const createPatient = async (req, res) => {
    try {
        const { clerkId, name, email, imageUrl } = req.body;
        
        // Check if patient already exists
        const existingPatient = await Patient.findOne({ clerkId });
        if (existingPatient) {
            return res.status(200).json(existingPatient);
        }

        const patient = await Patient.create({ clerkId, name, email, imageUrl });
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPatientByClerkId = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const patient = await Patient.findOne({ clerkId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const updatedData = req.body;
        const patient = await Patient.findOneAndUpdate({ clerkId }, updatedData, { new: true });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const patient = await Patient.findOneAndDelete({ clerkId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};