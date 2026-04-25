import React, { useEffect, useState } from "react";
import axios from "axios";

function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchPatients();
  }, []);

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientPage;
