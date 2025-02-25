import ReservaManager from "./components/ReservaManager";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
      <ReservaManager />
    </div>
  );
}
