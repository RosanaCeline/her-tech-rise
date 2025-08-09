import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";  
import image from "../../assets/notfound.png";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (user) {
      navigate("/timeline");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-700">
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <img
          src={image}
          alt="Página não encontrada"
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: "80vh" }}
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-start px-16">
        <h1 className="text-8xl font-bold mb-4">404</h1>
        <p className="text-3xl mb-6">Página não encontrada</p>
        <p className="mb-8 max-w-lg">
          Estamos trabalhando para resolver isso. A página que você está
          procurando não existe ou houve um erro.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded transition"
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
}
