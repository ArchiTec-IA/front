import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { addMessage, extractProducts, sendSingleChat } from "@/store/chatSlice";
import { Mic, Send } from "lucide-react";
import { useRef, useState } from "react";

interface InputAreaComponentProps {
  isLoading: boolean;
}

export function InputAreaComponent({ isLoading }: InputAreaComponentProps) {
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const { mode, sessionId } = chatState;

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSend(audioUrl, true);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao gravar", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async (messageToSend = input, isAudio = false) => {
    if ((!isAudio && !messageToSend.trim()) || isLoading) return;
    if (isAudio && isLoading) return;

    const userMessageContent = messageToSend;
    if (!isAudio) setInput("");

    dispatch(
      addMessage({
        content: userMessageContent,
        sender: "user",
        type: isAudio ? "audio" : "text",
      }),
    );

    if (mode === "multiple") {
      dispatch(extractProducts({ message: userMessageContent, sessionId }));
    } else {
      dispatch(
        sendSingleChat({
          message: userMessageContent,
          sessionId,
          mode,
        }),
      );
    }
  };

  return (
    <div className="p-4 w-full z-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="relative flex items-end gap-2 w-full p-2 rounded-2xl border border-accent-foreground focus-within:ring-2 focus-within:ring-accent-foreground focus-within:border-transparent transition-all shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              mode === "single"
                ? "Descreva o produto ou faça uma pergunta..."
                : "Adicione itens (ex: '3 dobradiças curvas')..."
            }
            disabled={isLoading}
            className="flex-1 text-accent-foreground max-h-32 min-h-[44px] py-3 px-2 bg-transparent border-none focus:ring-0 resize-none placeholder:text-muted-foreground text-sm scrollbar-hide outline-none"
            rows={1}
          />

          <Button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className={cn(
              "mb-1 text-chat hover:text-chat/70 hover:bg-slate-100 rounded-full cursor-pointer",
              isRecording && "text-chat animate-pulse",
            )}
          >
            {isRecording && (
              <span className="absolute inset-0 rounded-full animate-ping bg-blue-500/30" />
            )}
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading || isRecording}
            size="icon"
            className="mb-1 bg-chat hover:bg-chat/70 text-white rounded-full shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
