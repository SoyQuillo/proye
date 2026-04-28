import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePatientPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    document_type: "",
    document_number: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    blood_type: "",
    allergies: "",
    chronic_conditions: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/patients", form);
      navigate("/patients");

    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(err.response?.data?.message || "Error creando paciente");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Paciente</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input name="document_type" placeholder="Tipo documento" onChange={handleChange} className="border p-2" />
        <input name="document_number" placeholder="Número documento" onChange={handleChange} className="border p-2" />

        <input name="first_name" placeholder="Nombre" onChange={handleChange} className="border p-2" />
        <input name="last_name" placeholder="Apellido" onChange={handleChange} className="border p-2" />

        <input type="date" name="birth_date" onChange={handleChange} className="border p-2" />
        
        <select name="gender" onChange={handleChange} className="border p-2">
          <option value="">Género</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>

        <input name="phone" placeholder="Teléfono" onChange={handleChange} className="border p-2" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" />

        <input name="address" placeholder="Dirección" onChange={handleChange} className="border p-2 col-span-2" />
        <input name="city" placeholder="Ciudad" onChange={handleChange} className="border p-2" />

        <select name="blood_type" onChange={handleChange} className="border p-2">
          <option value="">Tipo de sangre</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input name="allergies" placeholder="Alergias" onChange={handleChange} className="border p-2 col-span-2" />
        <input name="chronic_conditions" placeholder="Condiciones crónicas" onChange={handleChange} className="border p-2 col-span-2" />

        <input name="emergency_contact_name" placeholder="Contacto emergencia" onChange={handleChange} className="border p-2" />
        <input name="emergency_contact_phone" placeholder="Teléfono emergencia" onChange={handleChange} className="border p-2" />

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creando..." : "Crear Paciente"}
        </button>
      </form>
    </div>
  );
}

export default CreatePatientPage;