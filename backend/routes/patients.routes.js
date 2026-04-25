import express, { Router } from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";
import {
  addPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from "../controller/patient.controller.js";

const router = Router();

router.get("/", getPatients);
router.get("/:id", getPatientById);
router.post("/", addPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
