import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Panel Principal</h1>

      <div className="grid grid-cols-2 gap-6">

        <div
          onClick={() => navigate("/patients")}
          className="bg-blue-500 text-white p-6 rounded cursor-pointer hover:bg-blue-600"
        >
          <h2 className="text-xl font-bold">Pacientes</h2>
          <p>Gestionar pacientes</p>
        </div>

        <div
          onClick={() => navigate("/appointments")}
          className="bg-green-500 text-white p-6 rounded cursor-pointer hover:bg-green-600"
        >
          <h2 className="text-xl font-bold">Citas</h2>
          <p>Gestionar citas médicas</p>
        </div>

        
        <div
          onClick={() => navigate("/doctors")}
          className="bg-yellow-500 text-white p-6 rounded cursor-pointer hover:bg-yellow-600"
        >
          <h2 className="text-xl font-bold">Medicos</h2>
          <p>Gestionar medicos</p>
        </div>

      </div>
    </div>
  );
}

export default HomePage;