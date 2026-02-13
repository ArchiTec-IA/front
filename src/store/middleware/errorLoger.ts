import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { type ApiError } from "../chatSlice";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // Tipagem segura: tentamos tratar o payload como ApiError
    const payload = action.payload as ApiError | undefined;

    // Fallback de mensagens caso o backend não envie o campo 'detail'
    const errorMessage =
      payload?.detail ||
      (typeof action.payload === "string"
        ? action.payload
        : "Ocorreu um erro inesperado na operação.");

    toast.error("Erro na Plataforma", {
      description: errorMessage,
      duration: 5000,
    });
  }

  return next(action);
};
