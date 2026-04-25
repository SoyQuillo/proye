import pool from "../config/db.js";

const validatePatient = (data, isUpdate = false) => {
  const errors = [];

  const {
    document_type,
    document_number,
    first_name,
    last_name,
    birth_date,
    email,
    gender,
    blood_type,
  } = data;

  if (!isUpdate) {
    if (!document_type) errors.push("document_type es requerido");
    if (!document_number) errors.push("document_number es requerido");
    if (!first_name) errors.push("first_name es requerido");
    if (!last_name) errors.push("last_name es requerido");
    if (!birth_date) errors.push("birth_date es requerido");
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Email inválido");
  }

  if (gender && !["male", "female", "other"].includes(gender)) {
    errors.push("Género inválido");
  }

  if (
    blood_type &&
    !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(blood_type)
  ) {
    errors.push("Tipo de sangre inválido");
  }

  return errors;
};

export const getPatients = async (req, res) => {
  try {
    const getAllPatients = await pool.query(
      "SELECT * FROM patients WHERE is_active = true ",
    );
    res.json(getAllPatients.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo pacientes" });
  }
};

export const addPatient = async (req, res) => {
  try {
    const errors = validatePatient(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const {
      document_type,
      document_number,
      first_name,
      last_name,
      birth_date,
      gender,
      phone,
      email,
      address,
      city,
      blood_type,
      allergies,
      chronic_conditions,
      emergency_contact_name,
      emergency_contact_phone,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO patients (
        document_type, document_number, first_name, last_name, birth_date,
        gender, phone, email, address, city, blood_type,
        allergies, chronic_conditions,
        emergency_contact_name, emergency_contact_phone
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      ) RETURNING *`,
      [
        document_type,
        document_number,
        first_name,
        last_name,
        birth_date,
        gender,
        phone,
        email,
        address,
        city,
        blood_type,
        allergies,
        chronic_conditions,
        emergency_contact_name,
        emergency_contact_phone,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "El documento ya existe" });
    }

    res.status(500).json({ message: "Error creando paciente" });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validatePatient(req.body, true);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const {
      document_type,
      document_number,
      first_name,
      last_name,
      birth_date,
      gender,
      phone,
      email,
      address,
      city,
      blood_type,
      allergies,
      chronic_conditions,
      emergency_contact_name,
      emergency_contact_phone,
    } = req.body;

    const result = await pool.query(
      `UPDATE patients SET
        document_type = $1,
        document_number = $2,
        first_name = $3,
        last_name = $4,
        birth_date = $5,
        gender = $6,
        phone = $7,
        email = $8,
        address = $9,
        city = $10,
        blood_type = $11,
        allergies = $12,
        chronic_conditions = $13,
        emergency_contact_name = $14,
        emergency_contact_phone = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *`,
      [
        document_type,
        document_number,
        first_name,
        last_name,
        birth_date,
        gender,
        phone,
        email,
        address,
        city,
        blood_type,
        allergies,
        chronic_conditions,
        emergency_contact_name,
        emergency_contact_phone,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Documento ya existe" });
    }

    res.status(500).json({ message: "Error actualizando paciente" });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE patients 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json({ message: "Paciente desactivado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar paciente" });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM patients WHERE id = $1 AND is_active = true",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo paciente" });
  }
};
