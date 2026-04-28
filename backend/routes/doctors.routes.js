import { Router } from "express";
import {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controller/doctor.controller.js";

const router = Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/", addDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;