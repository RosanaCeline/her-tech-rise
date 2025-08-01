import logo from "../../assets/logo/LogoSimbol.png";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin shadow-[0_0_20px_rgba(155,81,224,0.5)]"></div>
        <img
          src={logo}
          alt="Loading Logo"
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"
          style={{ filter: "drop-shadow(0 0 8px rgba(155, 81, 224, 0.9))" }}
        />
      </div>
    </div>
  )
}