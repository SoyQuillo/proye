import React, { useEffect, useState } from "react";
import axios from "axios";

function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/appointments");
      console.log(res.data);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <div className="p-4">Cargando citas...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Citas</h1>

      {appointments.length === 0 ? (
        <p>No hay citas registradas</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Paciente</th>
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Hora</th>
              <th className="p-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="text-center">
                <td className="p-2 border">
                  {a.first_name} {a.last_name}
                </td>

                <td className="p-2 border">
                  {a.doctor_first_name} {a.doctor_last_name}
                </td>

                <td className="p-2 border">
                  {a.appointment_date?.split("T")[0]}
                </td>

                <td className="p-2 border">
                  {a.appointment_time}
                </td>
                
                <td className="p-2 border">
                  {a.status || "pendiente"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AppointmentPage;