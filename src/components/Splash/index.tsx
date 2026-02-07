import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo-boavista-Preto.png";
const ANIMATION_DURATION_MS = 3500;

export function SplashComponent({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, ANIMATION_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full items-center justify-center h-[100dvh] bg-background",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          src={logoImage}
          alt="Logo Boa Vista"
          className={cn(
            "w-48 h-auto",
            "animate-in fade-in-0 duration-1000",
            "animate-pulse-slow",
          )}
        />
        <p className="text-muted-foreground mt-2 animate-in fade-in-0">
          Preparando seu ambiente de projetos...
        </p>
      </div>
    </div>
  );
}
