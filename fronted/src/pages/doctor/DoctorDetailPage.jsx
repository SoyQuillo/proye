import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    axios.get(`/api/doctors/${id}`).then(res => setDoctor(res.data));
  }, [id]);

  if (!doctor) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Dr. {doctor.first_name} {doctor.last_name}
      </h1>

      <p><b>Especialidad:</b> {doctor.specialty}</p>
      <p><b>Email:</b> {doctor.email}</p>
      <p><b>Teléfono:</b> {doctor.phone}</p>
    </div>
  );
}

export default DoctorDetailPage;