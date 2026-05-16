import mongoose from "mongoose";
import Patient from "./Server/models/PatientModel.js";

console.log("Patient Model imported successfully");
console.log("Schema paths:", Object.keys(Patient.schema.paths));
process.exit(0);
