import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="w-full bg-[#f1f1f7] border-b border-gray-200">
      <div className="max-w-[1024px] mx-auto py-4 flex items-center">
        <img src={logo} alt="logo" className="h-8" />
      </div>
    </header>
  );
}
