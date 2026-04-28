import pool from "../config/db.js";

const validateDoctor = (data) => {
  const errors = [];

  const { first_name, last_name, specialty, email } = data;

  if (!first_name) errors.push("first_name es requerido");
  if (!last_name) errors.push("last_name es requerido");
  if (!specialty) errors.push("specialty es requerido");

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Email inválido");
  }

  return errors;
};

export const addDoctor = async (req, res) => {
  try {
    const errors = validateDoctor(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { first_name, last_name, specialty, phone, email } = req.body;

    const result = await pool.query(
      `INSERT INTO doctors (first_name, last_name, specialty, phone, email)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [first_name, last_name, specialty, phone, email],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Email ya existe" });
    }

    res.status(500).json({ message: "Error creando médico" });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM doctors WHERE is_active = true ORDER BY id DESC",
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo médicos" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM doctors WHERE id = $1 AND is_active = true",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo médico" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validateDoctor(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { first_name, last_name, specialty, phone, email } = req.body;

    const result = await pool.query(
      `UPDATE doctors SET
        first_name = $1,
        last_name = $2,
        specialty = $3,
        phone = $4,
        email = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [first_name, last_name, specialty, phone, email, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Email ya existe" });
    }

    res.status(500).json({ message: "Error actualizando médico" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE doctors
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json({ message: "Médico eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando médico" });
  }
};
