import logo from "../assets/logo.png";
import backgroundImage from "../assets/background.jpg";

export default function Header() {
  return (
    <header
      className="w-full bg-[#C4D9FF] border-b"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[1024px] mx-auto py-2 flex items-center justify-between">
        <h1
          className="text-[36px] font-tenorite text-white"
          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0.4, 0.6)" }}
        >
          bo:matic
        </h1>
        <img src={logo} alt="logo" className="h-8" />
      </div>
    </header>
  );
}
