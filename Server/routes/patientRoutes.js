import express from "express";
import { 
    createPatient, 
    getPatientByClerkId, 
    getAllPatients, 
    updatePatient, 
    deletePatient 
} from "../controllers/PatientController.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:clerkId", getPatientByClerkId);
router.put("/:clerkId", updatePatient);
router.delete("/:clerkId", deletePatient);

export default router;
