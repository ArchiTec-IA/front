import { ItemsList } from "@/assets/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Aside from "./components/Aside";
import { MessagesComponent } from "./components/Messages";
import { ModeSelectionComponent } from "./components/ModeSeletion";
import { NoContentComponent } from "./components/NoContent";
import { InputAreaComponent } from "./components/inputArea";

const API_BASE_URL = "api";

export function IaComponent() {
  const chatState = useAppSelector((state) => state.chat);
  const { messages, productList, mode, sessionId, status, pdfUrl } = chatState;

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "loading";

  useEffect(() => {
    if (productList.length > 0 && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList.length, mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="flex h-full w-full overflow-hidden bg-background relative rounded-xl">
      <div className="flex-1 flex flex-col h-full relative min-w-0 bg-background">
        <ModeSelectionComponent isLoading={isLoading} />
        {!isSidebarOpen && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="h-12 w-12 rounded-xl border-accent-foreground shadow-lg bg-background hover:bg-muted/80 transition-all duration-300 group hover:cursor-pointer"
            >
              <ItemsList className="h-6 w-6 text-accent-foreground group-hover:cursor-pointer" />

              <span
                className={cn(
                  "absolute -top-2 -right-2 text-sidebar-accent text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-sm transition-transform duration-200",
                  "bg-sidebar-primary scale-90",
                )}
              >
                {productList.length}
              </span>
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative z-0">
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
        <InputAreaComponent isLoading={isLoading} />
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
