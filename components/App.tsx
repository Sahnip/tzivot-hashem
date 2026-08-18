export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Mon app</h1>

      <a href="/foo" className="inline-block px-4 py-2 rounded">
        Lien avec hover verre
      </a>

      <button className="ml-4 px-4 py-2 rounded">
        Bouton avec hover verre
      </button>
    </div>
  );
}