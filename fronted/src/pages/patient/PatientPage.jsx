import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/api/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);


  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "¿Seguro que quieres eliminar este paciente?",
    );
    if (!confirm) return;

    try {
      await axios.delete(`/api/patients/${id}`);

      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando paciente");
    }
  };

  if (loading) {
    return <div className="p-4">Cargando pacientes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>

      {patients.length === 0 ? (
        <p>No hay pacientes registrados</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Documento</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Ciudad</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="text-center">
                <td className="p-2 border">
                  {patient.first_name} {patient.last_name}
                </td>
                <td className="p-2 border">
                  {patient.document_type} {patient.document_number}
                </td>
                <td className="p-2 border">{patient.phone || "-"}</td>
                <td className="p-2 border">{patient.city || "-"}</td>

              
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                  >
                    <FaEye />
                  </button>

                
                  <button
                    onClick={() => navigate(`/patients/edit/${patient.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                  >
                    <FaEdit />
                  </button>

            
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientPage;
