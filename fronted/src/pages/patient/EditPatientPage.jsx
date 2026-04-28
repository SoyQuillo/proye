import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditPatientPage() {
  const { id } = useParams(); // 👈 id de la URL
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`/api/patients/${id}`);

        const data = {
          ...res.data,
          birth_date: res.data.birth_date?.split("T")[0] || "",
        };

        setForm(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(`/api/patients/${id}`, form);
      navigate("/patients");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(err.response?.data?.message || "Error actualizando paciente");
      }
    }
  };

  if (loading) return <div className="p-4">Cargando paciente...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Paciente</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input name="document_type" value={form.document_type} onChange={handleChange} className="border p-2" />
        <input name="document_number" value={form.document_number} onChange={handleChange} className="border p-2" />

        <input name="first_name" value={form.first_name} onChange={handleChange} className="border p-2" />
        <input name="last_name" value={form.last_name} onChange={handleChange} className="border p-2" />

        <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="border p-2" />
        
        <select name="gender" value={form.gender} onChange={handleChange} className="border p-2">
          <option value="">Género</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>

        <input name="phone" value={form.phone || ""} onChange={handleChange} className="border p-2" />
        <input name="email" value={form.email || ""} onChange={handleChange} className="border p-2" />

        <input name="address" value={form.address || ""} onChange={handleChange} className="border p-2 col-span-2" />
        <input name="city" value={form.city || ""} onChange={handleChange} className="border p-2" />

        <select name="blood_type" value={form.blood_type || ""} onChange={handleChange} className="border p-2">
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

        <input name="allergies" value={form.allergies || ""} onChange={handleChange} className="border p-2 col-span-2" />
        <input name="chronic_conditions" value={form.chronic_conditions || ""} onChange={handleChange} className="border p-2 col-span-2" />

        <input name="emergency_contact_name" value={form.emergency_contact_name || ""} onChange={handleChange} className="border p-2" />
        <input name="emergency_contact_phone" value={form.emergency_contact_phone || ""} onChange={handleChange} className="border p-2" />

        <button className="col-span-2 bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditPatientPage;