import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardItemsProps = {
  id?: string;
  className?: string;
  title?: string;
  description?: string;
};

export function CardItem({
  id,
  className,
  title,
  description,
}: CardItemsProps) {
  return (
    <Card
      className={cn(
        className,
        "max-w-60 min-w-60 h-60 bg-muted-foreground flex justify-end p-0 overflow-hidden hover:cursor-pointer border-none"
      )}
      onClick={() => console.log("Abrir Prajeissssra: ", id)}
    >
      <CardFooter className="flex flex-col items-center justify-center h-22 bg-muted p-0">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
        <CardContent>
          <p className="text-fore-ground text-sm">{description}</p>
        </CardContent>
      </CardFooter>
    </Card>
  );
}
