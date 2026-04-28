import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateDoctorPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    specialty: "",
    phone: "",
    email: "",
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
      await axios.post("/api/doctors", form);
      navigate("/doctors");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(err.response?.data?.message || "Error creando médico");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Médico</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input name="first_name" placeholder="Nombre" onChange={handleChange} className="border p-2" />
        <input name="last_name" placeholder="Apellido" onChange={handleChange} className="border p-2" />

        <input name="specialty" placeholder="Especialidad" onChange={handleChange} className="border p-2 col-span-2" />

        <input name="phone" placeholder="Teléfono" onChange={handleChange} className="border p-2" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" />

        <button className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {loading ? "Creando..." : "Crear Médico"}
        </button>
      </form>
    </div>
  );
}

export default CreateDoctorPage;