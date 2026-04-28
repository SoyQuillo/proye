import pool from "../config/db.js";

export const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
        p.first_name, p.last_name,
        d.first_name AS doctor_first_name,
        d.last_name AS doctor_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date, a.appointment_time
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("ERROR GET APPOINTMENTS:", error); // 🔥 IMPORTANTE
    res.status(500).json({ message: "Error obteniendo citas" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        a.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        d.first_name AS doctor_first_name,
        d.last_name AS doctor_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = $1
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo cita" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
    } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        message: "Campos obligatorios faltantes",
      });
    }

    const patient = await pool.query(
      "SELECT id FROM patients WHERE id = $1 AND is_active = true",
      [patient_id],
    );

    if (patient.rowCount === 0) {
      return res.status(400).json({ message: "Paciente inválido" });
    }

    const doctor = await pool.query(
      "SELECT id FROM doctors WHERE id = $1 AND is_active = true",
      [doctor_id],
    );

    if (doctor.rowCount === 0) {
      return res.status(400).json({ message: "Doctor inválido" });
    }

    const result = await pool.query(
      `
      INSERT INTO appointments 
      (patient_id, doctor_id, appointment_date, appointment_time, reason)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [patient_id, doctor_id, appointment_date, appointment_time, reason],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Ese horario ya está ocupado",
      });
    }

    res.status(500).json({ message: "Error creando cita" });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { appointment_date, appointment_time, status, reason } = req.body;

    const result = await pool.query(
      `
      UPDATE appointments SET
        appointment_date = $1,
        appointment_time = $2,
        status = $3,
        reason = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [appointment_date, appointment_time, status, reason, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando cita" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM appointments WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando cita" });
  }
};

export const searchPatients = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await pool.query(
      `
      SELECT id, first_name, last_name, document_number
      FROM patients
      WHERE is_active = true
      AND (
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR 
        document_number ILIKE $1
      )
      LIMIT 10
      `,
      [`%${q}%`],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error buscando pacientes" });
  }
};

export const searchDoctors = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await pool.query(
      `
      SELECT id, first_name, last_name, speciality
      FROM doctors
      WHERE is_active = true
      AND (
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR 
        speciality ILIKE $1
      )
      LIMIT 10
      `,
      [`%${q}%`],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error buscando doctores" });
  }
};
