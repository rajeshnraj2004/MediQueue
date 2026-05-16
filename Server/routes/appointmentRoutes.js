import express from "express";
import { 
    bookAppointment, 
    getPatientAppointments, 
    cancelAppointment 
} from "../controllers/AppointmentController.js";

const router = express.Router();

router.post("/", bookAppointment);
router.get("/:clerkId", getPatientAppointments);
router.put("/cancel/:id", cancelAppointment);

export default router;
