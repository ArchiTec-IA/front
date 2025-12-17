import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calculator,
  Download,
  Send,
  Trash2,
  Mic,
  List,
  X,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { MessagesComponent } from "./components/Messages";
import { NoContentComponent } from "./components/NoContent";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  sendSingleChat,
  extractProducts,
  generateMultipleQuote,
  addMessage,
  clearProductList,
  removeProduct,
} from "@/store/chatSlice";
import { cn, formatCurrencyBRL } from "@/lib/utils";
import { VoiceModal } from "./components/VoiceModal";
import { useSpeechRecognition } from "@/hooks/use-speech-recongnition";
import { ModeSelectionComponent } from "./components/ModeSeletion";
import { ScrollArea } from "../ui/scroll-area";
import { ItemsList } from "@/assets/icons";

const API_BASE_URL = "api";

export function IaComponent() {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const { messages, productList, mode, sessionId, status, pdfUrl, error } =
    chatState;

  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estado para controlar a sidebar lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "loading";

  // Abre a sidebar automaticamente na primeira adição de itens se estiver no modo multiple
  useEffect(() => {
    if (mode === "multiple" && productList.length > 0 && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList.length, mode]);

  // Fecha a sidebar se mudar para o modo single
  useEffect(() => {
    if (mode === "single" && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [mode, isSidebarOpen]);

  const handleVoiceResult = useCallback((transcript: string) => {
    if (transcript.trim()) {
      setInput(transcript.trim());
    }
  }, []);

  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
  } = useSpeechRecognition(handleVoiceResult);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim() || isLoading) return;

    const userMessageContent = messageToSend;
    setInput("");

    dispatch(addMessage({ content: userMessageContent, sender: "user" }));

    if (mode === "multiple") {
      dispatch(extractProducts({ message: userMessageContent, sessionId }));
    } else {
      dispatch(
        sendSingleChat({ message: userMessageContent, sessionId, mode })
      );
    }
  };

  const handleGenerateQuote = () => {
    if (productList.length === 0 || isLoading) return;
    dispatch(generateMultipleQuote({ products: productList, sessionId }));
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
    0
  );

  return (
    <div className="flex h-full w-full overflow-hidden bg-white relative rounded-lg border border-slate-200">
      {/* Modal de Voz */}
      <VoiceModal
        isOpen={isListening}
        onStop={stopListening}
        message={
          transcript ? "Transcrição em andamento..." : "Ouvindo... Fale agora."
        }
        transcript={transcript}
      />

      {/* ================= ESQUERDA: ÁREA DO CHAT ================= */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 bg-[#F9F9F9]">
        {!isSidebarOpen && mode === "multiple" && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="h-12 w-12 rounded-xl border-slate-200 shadow-lg bg-white hover:bg-slate-50 transition-all duration-300 group"
            >
              <ItemsList className="h-6 w-6 text-slate-600 group-hover:text-slate-900" />

              {/* Badge Verde com contador */}
              <span
                className={cn(
                  "absolute -top-2 -right-2 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform duration-200",
                  productList.length > 0
                    ? "bg-green-500 scale-100"
                    : "bg-slate-400 scale-90"
                )}
              >
                {productList.length}
              </span>
            </Button>
          </div>
        )}
        {/* Lista de Mensagens */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative z-0 bg-white">
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
        <div className="p-4 bg-white border-t border-slate-100 w-full z-10">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div className="relative flex items-end gap-2 w-full p-2 rounded-2xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
              <Button
                onClick={startListening}
                disabled={isLoading || isListening}
                variant="ghost"
                size="icon"
                className={cn(
                  "mb-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer",
                  isListening && "text-red-500 animate-pulse bg-red-50"
                )}
              >
                <Mic className="h-5 w-5" />
              </Button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  mode === "single"
                    ? "Descreva o produto ou faça uma pergunta..."
                    : "Adicione itens (ex: '3 dobradiças curvas')..."
                }
                disabled={isLoading || isListening}
                className="flex-1 max-h-32 min-h-[44px] py-3 px-2 bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-400 text-sm scrollbar-hide outline-none"
                rows={1}
              />

              <Button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading || isListening}
                size="icon"
                className="mb-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <ModeSelectionComponent
              isListening={isListening}
              isLoading={isLoading}
            />

            {(voiceError || (error && !voiceError)) && (
              <p className="text-xs text-red-500 text-center animate-pulse">
                {voiceError ? `Erro de Voz: ${voiceError}` : `Erro: ${error}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= DIREITA: SIDEBAR DESLIZANTE ================= */}
      <div
        className={cn(
          "bg-white border-l border-slate-200 transition-all duration-300 ease-in-out flex flex-col h-full shadow-2xl z-40 absolute right-0 md:relative",
          isSidebarOpen
            ? "w-full md:w-96 translate-x-0 opacity-100"
            : "w-0 translate-x-full opacity-0 md:translate-x-0 md:w-0"
        )}
      >
        {/* Header da Sidebar */}
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm min-w-[384px]">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                Lista de Itens
              </h2>
              <p className="text-xs text-slate-500">Resumo do orçamento</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
              {productList.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo da Lista */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white min-w-[384px]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span>Produto</span>
            <span className="text-center w-10">Qtd</span>
            <span className="text-right w-20">Total</span>
            <span className="w-8"></span>
          </div>

          <ScrollArea className="flex-1">
            {productList.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3 px-8 text-center mt-10">
                <div className="bg-slate-50 p-4 rounded-full mb-2">
                  <List className="h-8 w-8 opacity-30" />
                </div>
                <p className="text-sm font-medium">Sua lista está vazia.</p>
                <p className="text-xs opacity-70 max-w-[200px]">
                  Descreva o projeto no chat para a IA identificar os itens
                  necessários.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {productList.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-2 p-3 items-center hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span
                        className="font-medium text-sm text-slate-700 truncate"
                        title={product.name}
                      >
                        {product.name}
                      </span>
                      {product.dimensions && (
                        <span className="text-[10px] text-slate-400 truncate mt-0.5">
                          {product.dimensions}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-center w-10">
                      <span className="text-xs font-medium bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded shadow-sm">
                        {product.quantity}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-700 text-right w-20">
                      {formatCurrencyBRL(product.price * product.quantity)}
                    </div>

                    <div className="flex justify-end w-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(removeProduct(index))}
                        disabled={isLoading}
                        className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer da Sidebar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 min-w-[384px]">
          <div className="flex justify-between items-end">
            <span className="text-sm text-slate-500 font-medium mb-1">
              Valor Estimado:
            </span>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">
              {formatCurrencyBRL(totalValue)}
            </span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGenerateQuote}
              disabled={productList.length === 0 || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-md h-11 rounded-lg transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Calculator className="mr-2 h-4 w-4" /> Gerar Orçamento
                </div>
              )}
            </Button>

            {productList.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearProductList())}
                disabled={isLoading}
                className="w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 h-8 cursor-pointer"
              >
                Limpar todos os itens
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
