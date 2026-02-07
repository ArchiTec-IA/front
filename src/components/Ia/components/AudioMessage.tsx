import { cn } from "@/lib/utils";
import { Play, Pause, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

export default function AudioMessage({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const waveBars = [
    40, 70, 45, 90, 65, 30, 50, 80, 35, 60, 40, 75, 50, 90, 60, 40, 70, 45, 85,
    55, 30, 50, 80, 40, 60, 45, 90, 65, 35, 55, 40, 75, 50, 85, 60, 45, 70, 35,
    90, 50,
  ];

  return (
    <div className="flex w-full items-center gap-3 bg-black/10 dark:bg-white/5 p-3 rounded-2xl border border-white/10">
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
      >
        {isPlaying ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" className="ml-1" />
        )}
      </button>

      <div className="flex-1 flex justify-between items-center gap-[3px] h-10 px-1">
        {waveBars.map((heightPerc, i) => (
          <div
            key={i}
            className={cn(
              "w-[2px] sm:w-[3px] rounded-full transition-all duration-300",
              isPlaying
                ? "bg-foreground animate-pulse"
                : "bg-muted-foreground/40",
            )}
            style={{
              height: `${heightPerc}%`,
              animationDelay: isPlaying ? `${i * 0.05}s` : "0s",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-end gap-1">
        <Volume2 size={14} className="text-muted-foreground opacity-50" />
        <span className="text-[10px] text-muted-foreground font-medium">
          0:00
        </span>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
