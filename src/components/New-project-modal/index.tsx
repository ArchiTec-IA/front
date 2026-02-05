import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function NewProjectModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-foreground font-medium hover: cursor-pointer hover:bg-primary/50">
          + Novo Projeto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-background border-none rounded-xl">
        <form onSubmit={() => console.log("submitando")}>
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Criar Novo Projeto
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Insira os detalhes do seu novo projeto.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <Label
                htmlFor="name"
                className="text-right text-foreground w-full text-sm"
              >
                Nome do Projeto
              </Label>
              <Input
                id="name"
                className="col-span-3 border-input bg-background"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label
                htmlFor="client"
                className="text-right text-foreground text-sm"
              >
                Cliente
              </Label>
              <Input
                id="client"
                className="col-span-3 border-input bg-background"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-primary text-accsent hover:bg-primary/70 hover:cursor-pointer"
            >
              Criar Projeto
            </Button>
            <Button
              type="button"
              className="bg-destructive/50 text-accsent hover:bg-destructive/70 hover:cursor-pointer"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
