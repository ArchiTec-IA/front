import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { setCurrentProject } from "@/store/projectSlice";
import { useNavigate } from "react-router-dom";

type CardItemsProps = {
  id?: string;
  className?: string;
  title?: string;
  description?: string;
};

export function CardItem({ className, title, description }: CardItemsProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCardClick = () => {
    dispatch(setCurrentProject(title || null));

    navigate(`/ia`);
  };
  return (
    <div onClick={handleCardClick} className="contents">
      <Card
        className={cn(
          className,
          "max-w-60 min-w-60 h-60 bg-muted-foreground flex justify-end p-0 overflow-hidden hover:cursor-pointer border-none",
        )}
      >
        <CardFooter className="flex flex-col items-center justify-center h-22 bg-muted p-0">
          <CardTitle className="text-base font-bold">{title}</CardTitle>
          <CardContent>
            <p className="text-fore-ground text-sm">{description}</p>
          </CardContent>
        </CardFooter>
      </Card>
    </div>
  );
}
