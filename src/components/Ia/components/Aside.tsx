import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch } from "@/hooks/hooks";
import { formatCurrencyBRL } from "@/lib/utils";
import {
  clearProductList,
  generateMultipleQuote,
  removeProduct,
  type ProductItem,
} from "@/store/chatSlice";
import { Calculator, List, Trash2, X } from "lucide-react";

interface AsideProps {
  productList: ProductItem[];
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  totalValue: number;
  sessionId: string;
}

export default function Aside({
  productList,
  setIsSidebarOpen,
  isLoading,
  totalValue,
  sessionId,
}: AsideProps) {
  const dispatch = useAppDispatch();

  const handleGenerateQuote = () => {
    if (productList.length === 0 || isLoading) return;
    dispatch(generateMultipleQuote({ products: productList, sessionId }));
  };

  return (
    <>
      {/* Header da Sidebar */}
      <div className="p-4 bg-background border-b flex justify-between items-center shadow-sm min-w-[334px]">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="font-bold text-foreground text-sm">
              Lista de Itens
            </h2>
            <p className="text-xs text-foreground">Resumo do orçamento</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
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
      <div className="flex-1 overflow-hidden flex flex-col bg-background min-w-[384px]">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2 bg-background border-b border-slate-100 text-[11px] font-semibold text-foreground uppercase tracking-wider">
          <span>Produto</span>
          <span className="text-center w-10">Qtd</span>
          <span className="text-right w-20">Total</span>
          <span className="w-8"></span>
        </div>

        <ScrollArea className="flex-1">
          {productList.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3 px-8 text-center mt-10">
              <div className="bg-muted p-4 rounded-full mb-2">
                <List className="h-8 w-8 opacity-80" />
              </div>
              <p className="text-sm  text-foreground font-medium">
                Sua lista está vazia.
              </p>
              <p className="text-xs text-foreground max-w-[200px]">
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

                  <div className="text-sm font-semibold text-foreground text-right w-20">
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
      <div className="p-4 bg-background border-t border-slate-200 space-y-4 min-w-[384px]">
        <div className="flex justify-between items-end">
          <span className="text-sm text-foreground font-medium mb-1">
            Valor Estimado:
          </span>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrencyBRL(totalValue)}
          </span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleGenerateQuote}
            disabled={productList.length === 0 || isLoading}
            className="w-full bg-sidebar hover:bg-green-700 text-foreground font-bold shadow-md h-11 rounded-lg transition-all cursor-pointer"
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
