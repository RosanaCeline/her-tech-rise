import logo from "../../assets/logo/LogoNamePurple.png";

export default function LoadingSpinner() {
  return (
    <>
      <style>{`
        @keyframes loading-bar {
          0% {
            left: -20%;
            width: 20%;
            opacity: 1;
          }
          50% {
            left: 50%;
            width: 30%;
            opacity: 0.7;
          }
          100% {
            left: 100%;
            width: 20%;
            opacity: 0;
          }
        }
      `}</style>

      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 p-6" 
           style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <img
          src={logo}
          alt="Loading Logo"
          className="w-130 h-auto rounded-lg mb-8"
          // removei a sombra
        />

        <div className="relative w-72 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 h-4 bg-purple-600 rounded-full"
            style={{
              animation: "loading-bar 2s infinite ease-in-out",
              left: "-20%",
              width: "20%",
            }}
          />
        </div>
      </div>
    </>
  );
}