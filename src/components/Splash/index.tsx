import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logoBoa.png";
const ANIMATION_DURATION_MS = 2500; // Duração da animação em milissegundos (2.5 segundos)

export function SplashComponent({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();

  React.useEffect(() => {
    // 1. Redirecionar após a duração da animação
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, ANIMATION_DURATION_MS);

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [navigate]);

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full items-center justify-center h-[100dvh] bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          src={logoImage}
          alt="Logo Boa Vista"
          className={cn(
            "w-48 h-auto", // Define o tamanho da imagem (ajuste w-48 conforme a necessidade)
            "animate-in fade-in-0 duration-1000",
            "animate-pulse-slow" // Efeito de pulsação (requer classes do tw-animate-css)
          )}
        />
        <p className="text-muted-foreground mt-2 animate-in fade-in-0">
          Preparando seu ambiente de projetos...
        </p>
      </div>
    </div>
  );
}
