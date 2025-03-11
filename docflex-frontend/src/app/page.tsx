import Image from "next/image";
import LoginForm from "@/sections/LoginSection/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0D4C73] to-[#000000] p-6">
      {/* Logo Image Section */}
      <div className="flex flex-col items-center gap-2">
        {/* DocFlex Logo */}
        <Image
          src="/docflexLogo.png"
          alt="Docflex Logo"
          width={120} 
          height={100}
          priority
        />

        {/* Login Illustration */}
        <Image
          src="/logImg.png"
          alt="Login Image"
          width={250} 
          height={100}
          priority
          className="w-[250px] h-auto md:w-[310px]"
        />
      </div>

      {/* Login Form Section */}
      <div className="p-6 rounded-lg shadow-sm bg-white w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
