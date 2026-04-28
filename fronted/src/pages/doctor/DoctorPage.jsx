import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function DoctorPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    const res = await axios.get("/api/doctors");
    setDoctors(res.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar médico?")) return;

    await axios.delete(`/api/doctors/${id}`);
    setDoctors(doctors.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Médicos</h1>
        <button
          onClick={() => navigate("/doctors/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Crear
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="text-center">
              <td>{d.first_name} {d.last_name}</td>
              <td>{d.specialty}</td>
              <td>{d.phone || "-"}</td>

              <td className="flex justify-center gap-2 p-2">
                <button
                  onClick={() => navigate(`/doctors/edit/${d.id}`)}
                  className="bg-yellow-500 p-2 text-white rounded"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-500 p-2 text-white rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorPage;