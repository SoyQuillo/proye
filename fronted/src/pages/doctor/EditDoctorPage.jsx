import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditDoctorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    specialty: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await axios.get(`/api/doctors/${id}`);
      setForm(res.data);
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/doctors/${id}`, form);
      navigate("/doctors");
    } catch (err) {
      setError("Error actualizando médico");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Médico</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input name="first_name" value={form.first_name} onChange={handleChange} className="border p-2" />
        <input name="last_name" value={form.last_name} onChange={handleChange} className="border p-2" />

        <input name="specialty" value={form.specialty} onChange={handleChange} className="border p-2 col-span-2" />

        <input name="phone" value={form.phone || ""} onChange={handleChange} className="border p-2" />
        <input name="email" value={form.email || ""} onChange={handleChange} className="border p-2" />

        <button className="col-span-2 bg-yellow-600 text-white p-2 rounded">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

export default EditDoctorPage;