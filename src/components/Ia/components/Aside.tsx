import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { formatCurrencyBRL } from "@/lib/utils";
import {
  clearProductList,
  deleteMovel,
  type ComponenteItem,
  type ProductItem,
} from "@/store/chatSlice";
import { Calculator, FileText, List, X } from "lucide-react";
import { MovelCard } from "./Itens";

interface AsideProps {
  productList: ProductItem[];
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  totalValue: number;
  sessionId: string;
}

export default function Aside({ setIsSidebarOpen }: AsideProps) {
  const dispatch = useAppDispatch();

  const { productList, status, sessionId, pdfUrl } = useAppSelector(
    (state) => state.chat,
  );
  const isLoading = status === "loading";

  const isDownloadReady = !!pdfUrl;

  const handleAction = () => {
    if (pdfUrl) {
      // Abre o PDF em uma nova aba ou faz download
      window.open(pdfUrl, "_blank");
    }
  };

  // 2. Calculamos o total baseado na lista que veio da API
  const totalValue = productList.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  const handleEditComponent = (movelId: number, componente: ComponenteItem) => {
    console.log("Editar componente:", movelId, componente.nome);
    // Aqui abriremos o modal futuramente
  };

  return (
    <>
      <div className="p-4 bg-background border-b flex justify-between items-center shadow-sm min-w-[334px]">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-bold text-accent-foreground text-sm">
              Lista de Itens
            </h2>
            <p className="text-xs text-accent-foreground">
              Resumo do orçamento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 text-accent-foreground">
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
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          {productList.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-accent-foreground gap-3 px-8 text-center mt-10">
              <div className="bg-muted p-4 rounded-full mb-2">
                <List className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-sm  text-accent-foreground font-medium">
                Sua lista está vazia.
              </p>
              <p className="text-xs text-accent-foreground max-w-[200px]">
                Descreva o projeto no chat para a IA identificar os itens
                necessários.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              {productList.map((product, index) => (
                <MovelCard
                  key={`${product.id}-${index}`}
                  product={product}
                  onRemove={() => {
                    dispatch(
                      deleteMovel({
                        sessionId,
                        movelId: product.id,
                      }),
                    );
                  }}
                  onEditComponent={handleEditComponent}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-4 bg-background border-t border-slate-200 space-y-4 min-w-[384px]">
        {pdfUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(pdfUrl, "_blank")}
            className="w-full border-chat text-chat hover:bg-chat hover:text-white transition-all cursor-pointer h-9 text-xs gap-2"
          >
            <FileText className="h-4 w-4" /> Visualizar PDF Gerado
          </Button>
        )}
        <div className="flex justify-between items-end">
          <span className="text-sm text-accent-foreground font-medium mb-1">
            Valor Estimado:
          </span>
          <span className="text-2xl font-bold text-accent-foreground tracking-tight">
            {formatCurrencyBRL(totalValue)}
          </span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleAction}
            disabled={!isDownloadReady || isLoading}
            className="w-full bg-sidebar-primary hover:bg-green-700 text-foreground font-bold shadow-md h-11 rounded-lg transition-all cursor-pointer"
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
    </>
  );
}
