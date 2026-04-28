import React, { useState } from "react";
import axios from "axios";

function CreateAppointmentPage() {
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/appointments", form);
      alert("Cita creada correctamente");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creando cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-3 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Crear Cita</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-2 rounded">
          {error}
        </div>
      )}

      <input
        placeholder="ID Paciente"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, patient_id: e.target.value })
        }
      />

      <input
        placeholder="ID Doctor"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, doctor_id: e.target.value })
        }
      />

      <input
        type="date"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, appointment_date: e.target.value })
        }
      />

      <input
        type="time"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, appointment_time: e.target.value })
        }
      />

      <input
        placeholder="Motivo"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, reason: e.target.value })
        }
      />

      <button
        disabled={loading}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        {loading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}

export default CreateAppointmentPage;