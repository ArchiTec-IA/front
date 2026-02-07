import { ItemsList } from "@/assets/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { addMessage, extractProducts, sendSingleChat } from "@/store/chatSlice";
import { Download, Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Aside from "./components/Aside";
import { MessagesComponent } from "./components/Messages";
import { ModeSelectionComponent } from "./components/ModeSeletion";
import { NoContentComponent } from "./components/NoContent";

const API_BASE_URL = "api";

export function IaComponent() {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const { messages, productList, mode, sessionId, status, pdfUrl } = chatState;

  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "loading";

  useEffect(() => {
    if (mode === "multiple" && productList.length > 0 && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList.length, mode]);

  useEffect(() => {
    if (mode === "single" && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [mode, isSidebarOpen]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        sendSingleChat({ message: userMessageContent, sessionId, mode }),
      );
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const downloadUrl = `${API_BASE_URL}${pdfUrl}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `orcamento_${sessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Falha ao copiar texto: ", err);
    }
  };

  const formatTime = (isoDate: string) => {
    return new Date(isoDate).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalValue = productList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="flex h-full w-full overflow-hidden bg-background relative rounded-lg">
      {/* ================= ESQUERDA: ÁREA DO CHAT ================= */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 bg-background">
        <ModeSelectionComponent isLoading={isLoading} />
        {!isSidebarOpen && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="h-12 w-12 rounded-xl border-slate-200 shadow-lg bg-background hover:bg-muted/80 transition-all duration-300 group hover:cursor-pointer"
            >
              <ItemsList className="h-6 w-6 text-foreground group-hover:cursor-pointer" />

              {/* Badge Verde com contador */}
              <span
                className={cn(
                  "absolute -top-2 -right-2 text-foreground text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-sm transition-transform duration-200",
                  "bg-sidebar scale-90",
                )}
              >
                {productList.length}
              </span>
            </Button>
          </div>
        )}
        {/* Lista de Mensagens */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative z-0">
          {/* Container Centralizado para as mensagens */}
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col p-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <NoContentComponent />
              </div>
            ) : (
              <div className="space-y-6 flex-1">
                <MessagesComponent
                  formatTime={formatTime}
                  copyToClipboard={copyToClipboard}
                  copiedId={copiedId}
                  messages={messages}
                />
              </div>
            )}

            {isLoading && (
              <div className="flex gap-4 animate-in fade-in duration-300 mt-4 px-6">
                <Avatar className="h-8 w-8 bg-slate-400 rounded-full flex items-center justify-center p-0">
                  <AvatarFallback className="text-white">Q</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-md font-medium">QUIO</span>
                  </div>
                  <div className="flex space-x-2 p-2">
                    <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500/60 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-yellow-500/60 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Card de Download PDF - Centralizado junto com o fluxo */}
            {pdfUrl && (
              <div className="flex justify-center py-4 w-full animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center w-full max-w-lg p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">
                        Orçamento Pronto
                      </p>
                      <p className="text-xs text-blue-600">
                        PDF gerado com sucesso.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDownloadPdf}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                  >
                    Baixar
                  </Button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Área de Input - Fixa na parte inferior e centralizada */}
        <div className="p-4 w-full z-10">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div className="relative flex items-end gap-2 w-full p-2 rounded-2xl border border-foreground focus-within:ring-2 focus-within:ring-foreground focus-within:border-transparent transition-all shadow-sm">
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
                className="flex-1 max-h-32 min-h-[44px] py-3 px-2 bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-400 text-sm scrollbar-hide outline-none"
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
                  "mb-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer",
                  isRecording && "text-blue-500 animate-pulse",
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
                className="mb-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "mt-[1.2%] bg-background border border-slate-200 transition-all duration-300 ease-in-out flex flex-col h-[95%]  rounded-lg z-40 absolute right-0 md:relative mr-4 overflow-hidden",
          isSidebarOpen
            ? "w-full md:w-96 translate-x-0 opacity-100"
            : "w-0 translate-x-full opacity-0 md:translate-x-0 md:w-0",
        )}
      >
        <Aside
          isLoading={isLoading}
          productList={productList}
          sessionId={sessionId}
          setIsSidebarOpen={setIsSidebarOpen}
          totalValue={totalValue}
        />
      </div>
    </div>
  );
}
