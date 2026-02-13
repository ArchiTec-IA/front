import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings2, Trash2, Ruler, Layers } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";
import type { ProductItem, ComponenteItem } from "@/store/chatSlice";

interface MovelCardProps {
  product: ProductItem;
  onRemove: () => void;
  onEditComponent: (movelId: number, componente: ComponenteItem) => void;
}

export function MovelCard({
  product,
  onRemove,
  onEditComponent,
}: MovelCardProps) {
  return (
    <Collapsible className="rounded-xl border border-slate-200 bg-background shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <CollapsibleTrigger asChild>
            <div className="flex flex-col cursor-pointer group flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-accent-foreground group-hover:text-chat transition-colors truncate">
                  {product.name}
                </h3>
                <ChevronDown className="h-4 w-4 text-accent-foreground group-data-[state=open]:rotate-180 transition-transform duration-300" />
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[10px] font-medium text-accent-foreground bg-sidebar px-2 py-0.5 rounded">
                  <Ruler size={10} /> {product.dimensions}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-accent-foreground bg-sidebar px-2 py-0.5 rounded">
                  <Layers size={10} /> {product.material}
                </span>
              </div>
            </div>
          </CollapsibleTrigger>

          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-bold text-accent-foreground">
              {formatCurrencyBRL(product.price)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-7 w-7 text-accent-foreground hover:text-red-500 hover:bg-red-50 transition-all rounded-full cursor-pointer"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full border border-black/10 shadow-inner"
            style={{
              backgroundColor: product.color === "BRA" ? "#ccc" : "#ccc",
            }}
          />
          <span className="text-[10px] font-bold text-accent-foreground uppercase tracking-wider">
            Cor: {product.color}
          </span>
        </div>
      </div>

      <CollapsibleContent className="bg-background border-t border-slate-100 animate-in slide-in-from-top-2">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Settings2 size={12} className="text-accent-foreground" />
            <span className="text-[9px] font-bold text-accent-foreground uppercase tracking-widest">
              Composição Técnica
            </span>
          </div>

          <div className="grid gap-2">
            {product.componentes?.map((comp, i) => (
              <ComponenteRow
                key={i}
                componente={comp}
                onEdit={() => onEditComponent(product.id, comp)}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Sub-componente interno para a linha da peça
function ComponenteRow({
  componente,
  onEdit,
}: {
  componente: ComponenteItem;
  onEdit: () => void;
}) {
  return (
    <div className="flex justify-between items-center bg-background p-2.5 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-accent-foreground">
          {componente.nome}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] text-accent-foreground bg-sidebar px-1.5 rounded">
            {componente.quantidade}x
          </span>
          <span className="text-[9px] text-accent-foreground italic capitalize">
            {componente.categoria}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[11px] font-bold text-accent-foreground">
          {formatCurrencyBRL(componente.subtotal)}
        </span>
        <button
          onClick={onEdit}
          className="text-[9px] text-accent-foreground font-bold hover:underline cursor-pointer mt-0.5"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
