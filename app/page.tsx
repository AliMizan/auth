import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-t from-gray-900 to-gray-600 bg-gradient-to-r" >
     <div className="space-y-6 text-center"  >
      <h1 className="text-6xl font-semibold text-white drop-shadow-md" >
        Auth
      </h1>
      <p className="text-white text-lg" >
        Auth Service App
      </p>
      <div>
        <LoginButton>
        <Button size="lg" >
          Sign In
        </Button>
        </LoginButton>
      </div>

     </div>
    </main>
  );
}
