import { useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addProject, setIsOpenModal } from "@/store/projectSlice";

export function NewProjectModal() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.projects.isOpenModal);

  const handleClose = () => {
    dispatch(setIsOpenModal(false));
    setName("");
    setClient("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      client,
    };

    dispatch(addProject(newProject));

    setName("");
    setClient("");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => dispatch(setIsOpenModal(val))}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-foreground font-medium hover: cursor-pointer hover:bg-primary/50">
          + Novo Projeto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-background border-none rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-accent-foreground">
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
                className="text-right text-accent-foreground w-full text-sm"
              >
                Nome do Projeto:
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 border-input bg-background text-accent-foreground"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-1">
              <Label
                htmlFor="client"
                className="text-right text-accent-foreground text-sm"
              >
                Cliente:
              </Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="col-span-3 border-input bg-background text-accent-foreground"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-primary text-accsent hover:bg-primary/70 hover:cursor-pointer"
              disabled={!name.trim()}
            >
              Criar Projeto
            </Button>
            <Button
              type="button"
              className="bg-destructive/50 text-accsent hover:bg-destructive/70 hover:cursor-pointer"
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
