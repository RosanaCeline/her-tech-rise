import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";  
import image from "../../assets/notfound.png";
import BtnCallToAction from "../../components/btn/BtnCallToAction/BtnCallToAction";

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
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50 text-gray-700">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-10">
        <img
          src={image}
          alt="Página não encontrada"
          className="max-w-xs sm:max-w-sm md:max-w-full object-contain"
          style={{ maxHeight: "80vh" }}
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-3 md:gap-6 px-6 md:px-16 py-5">
        <h1 className="text-6xl md:text-8xl font-bold">404</h1>
        <p className="text-2xl md:text-3xl">Página não encontrada</p>
        <p className="max-w-lg text-base sm:text-xl">
          Estamos trabalhando para resolver isso. A página que você está
          procurando não existe ou houve um erro.
        </p>
        <BtnCallToAction
          onClick={handleGoBack}
          variant={'purple'}
        >
          Voltar para a página inicial
        </BtnCallToAction>
      </div>
    </div>
  );
}
