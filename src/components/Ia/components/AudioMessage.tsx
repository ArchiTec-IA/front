import { cn } from "@/lib/utils";
import { Play, Pause, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AudioMessage({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [waveform, setWaveform] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const mins = Math.floor(audioRef.current.duration / 60);
      const secs = Math.floor(audioRef.current.duration % 60);
      setDuration(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
    }
  };

  useEffect(() => {
    const generateWaveform = async () => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0); // Dados binários do som
        const samples = 50; // Quantidade de barrinhas (ajuste para densidade)
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];

        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }

        // Normaliza para que os picos preencham a altura total (0 a 100%)
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        const normalizedData = filteredData.map((n) => n * multiplier * 100);

        setWaveform(normalizedData);
      } catch (err) {
        console.error("Erro ao gerar waveform:", err);
      }
    };

    if (src) generateWaveform();
  }, [src]);

  return (
    <div className="flex w-full items-center gap-3 bg-black/10 dark:bg-white/5 p-3 rounded-2xl border border-white/10">
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-muted-foreground text-primary-foreground rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
      >
        {isPlaying ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" className="ml-1" />
        )}
      </button>

      <div className="flex-1 flex justify-between items-center gap-[3px] h-10 px-1">
        {waveform.length > 0 ? (
          waveform.map((height, i) => {
            const barProgress = (i / waveform.length) * 100;
            const isPlayed = progress > barProgress;

            return (
              <div
                key={i}
                className={cn(
                  "w-[5px] min-w-[1px] rounded-full transition-all duration-500",
                  isPlayed
                    ? "bg-primary" // Cor do áudio que já tocou (estilo WhatsApp)
                    : "bg-muted-foreground", // Cor do áudio que ainda não tocou
                )}
                style={{
                  height: `${Math.max(height, 8)}%`, // Altura mínima de 8% para silêncio
                }}
              />
            );
          })
        ) : (
          <div className="w-full h-[2px] bg-muted-foreground/20 animate-pulse" />
        )}
      </div>

      <div className="flex flex-col items-end gap-1">
        <Volume2 size={14} className="text-muted-foreground opacity-50" />
        <span className="text-[10px] text-muted-foreground font-medium">
          {duration}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
        className="hidden"
      />
    </div>
  );
}
