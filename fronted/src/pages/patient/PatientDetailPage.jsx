import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`/api/patients/${id}`);
        setPatient(res.data);
      } catch (err) {
        console.error(err);
        setError("Error cargando paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div className="p-4">Cargando paciente...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!patient) return <div className="p-4">Paciente no encontrado</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Detalle del Paciente</h1>

      <div className="border p-4 rounded space-y-2">
        <p><strong>Nombre:</strong> {patient.first_name} {patient.last_name}</p>
        <p><strong>Documento:</strong> {patient.document_type} {patient.document_number}</p>
        <p><strong>Fecha de nacimiento:</strong> {patient.birth_date?.split("T")[0]}</p>
        <p><strong>Género:</strong> {patient.gender}</p>
        <p><strong>Teléfono:</strong> {patient.phone || "-"}</p>
        <p><strong>Email:</strong> {patient.email || "-"}</p>
        <p><strong>Dirección:</strong> {patient.address || "-"}</p>
        <p><strong>Ciudad:</strong> {patient.city || "-"}</p>
        <p><strong>Tipo de sangre:</strong> {patient.blood_type || "-"}</p>
        <p><strong>Alergias:</strong> {patient.allergies || "-"}</p>
        <p><strong>Condiciones crónicas:</strong> {patient.chronic_conditions || "-"}</p>
        <p><strong>Contacto emergencia:</strong> {patient.emergency_contact_name || "-"}</p>
        <p><strong>Teléfono emergencia:</strong> {patient.emergency_contact_phone || "-"}</p>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigate("/patients")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Volver
        </button>

        <button
          onClick={() => navigate(`/patients/edit/${patient.id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

export default PatientDetailPage;