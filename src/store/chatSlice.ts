import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from ".";

export type ChatMode = "single" | "multiple";

export interface ComponenteItem {
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

export interface MovelItem {
  id: number;
  nome: string;
  dimensoes: string;
  material: string;
  cor: string;
  total: number;
  componentes: ComponenteItem[];
}

export interface ProductItem {
  id: number;
  name: string;
  dimensions?: string;
  material: string;
  color: string;
  price: number;
  componentes: ComponenteItem[];
  quantity: number;
}

export interface OrcamentoResponse {
  moveis: MovelItem[];
  total: number;
  finalizado: boolean;
}

export interface ProductItem {
  name: string;
  quantity: number;
  price: number;
  dimensions?: string;
}

export interface ChatOption {
  id: string;
  label: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  type: "text" | "audio";
  options?: ChatOption[];
}

interface ChatResponse {
  response: string;
  pdf_ready: boolean;
  pdf_filename?: string;
  download_url?: string;
  session_id: string;
  options?: ChatOption[];
}

interface ExtractProductsResponse {
  products: ProductItem[];
}

export interface ChatState {
  sessionId: string;
  mode: ChatMode;
  messages: Message[];
  productList: ProductItem[];
  pdfUrl: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface ApiError {
  detail?: string;
  error?: string;
  message?: string;
  status?: number;
}

const API_BASE_URL = "http://quio-alb-25446701.us-east-2.elb.amazonaws.com";
const generateSessionId = () =>
  "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

export const fetchCurrentOrcamento = createAsyncThunk<
  ProductItem[],
  string,
  { state: RootState }
>("chat/fetchCurrentOrcamento", async (sessionId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orcamento/${sessionId}`);
    if (!response.ok) throw new Error("Erro ao buscar itens");

    const data: OrcamentoResponse = await response.json();

    if (data.moveis && Array.isArray(data.moveis)) {
      // Mapeamento explícito de tipos
      return data.moveis.map(
        (m): ProductItem => ({
          id: m.id,
          name: m.nome,
          dimensions: m.dimensoes, // Agora ambos são 'string' sem '?'
          material: m.material,
          color: m.cor,
          price: m.total,
          quantity: 1,
          componentes: m.componentes,
        }),
      );
    }

    return [];
  } catch (error: unknown) {
    return rejectWithValue(error);
  }
});

export const deleteMovel = createAsyncThunk<
  void,
  { sessionId: string; movelId: number },
  { dispatch: AppDispatch; rejectValue: string }
>(
  "chat/deleteMovel",
  async ({ sessionId, movelId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orcamento/${sessionId}/remover/${movelId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha ao remover o móvel.");
      }

      // Após deletar no banco da AWS, atualizamos a lista local
      dispatch(fetchCurrentOrcamento(sessionId));

      dispatch(
        sendSingleChat({
          message: "mais",
          sessionId,
          mode: "single",
        }),
      );
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao remover o móvel.",
      );
    }
  },
);

export const selectChatOption = createAsyncThunk<
  void,
  { label: string; sessionId: string; mode: ChatMode },
  { dispatch: AppDispatch }
>("chat/selectOption", async ({ label, sessionId, mode }, { dispatch }) => {
  dispatch(
    addMessage({
      content: label,
      sender: "user",
      type: "text",
    }),
  );
  dispatch(sendSingleChat({ message: label, sessionId, mode }));
});

export const sendSingleChat = createAsyncThunk<
  ChatResponse,
  { message: string; sessionId: string; mode: ChatMode },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "chat/sendSingleChat",
  async ({ message, sessionId }, { rejectWithValue, dispatch }) => {
    const payload = {
      message,
      session_id: sessionId,
      mode: "single",
    };

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.error || "Falha ao processar a mensagem no modo único.",
      );
    }

    dispatch(fetchCurrentOrcamento(sessionId));

    return response.json();
  },
);

export const extractProducts = createAsyncThunk<
  ProductItem[],
  { message: string; sessionId: string },
  { rejectValue: string }
>(
  "chat/extractProducts",
  async ({ message, sessionId }, { rejectWithValue }) => {
    const response = await fetch(`${API_BASE_URL}/extract-products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.error || "Falha ao extrair produtos da mensagem.",
      );
    }

    const data: ExtractProductsResponse = await response.json();
    return data.products;
  },
);

export const generateMultipleQuote = createAsyncThunk<
  ChatResponse,
  { products: ProductItem[]; sessionId: string },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "chat/generateMultipleQuote",
  async ({ products, sessionId }, { rejectWithValue, dispatch }) => {
    const payload = {
      message: "generate_multiple_quote",
      session_id: sessionId,
      mode: "multiple",
      products: products,
    };

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.error || "Falha ao gerar o orçamento final.",
      );
    }

    dispatch(fetchCurrentOrcamento(sessionId));

    return response.json();
  },
);

const initialState: ChatState = {
  sessionId: generateSessionId(),
  mode: "single",
  messages: [],
  productList: [],
  pdfUrl: null,
  status: "idle",
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ChatMode>) => {
      state.mode = action.payload;
      // state.pdfUrl = null;
      // state.productList = [];
      // state.sessionId = generateSessionId();

      // state.messages = [];
      state.error = null;
    },
    addMessage: (
      state,
      action: PayloadAction<{
        content: string;
        sender: "user" | "bot";
        type: "text" | "audio";
      }>,
    ) => {
      state.messages.push({
        id: generateSessionId(),
        content: action.payload.content,
        sender: action.payload.sender,
        timestamp: new Date().toISOString(),
        type: action.payload.type,
      });
      state.error = null;
    },
    clearProductList: (state) => {
      state.productList = [];
      state.pdfUrl = null;
      state.messages.push({
        id: generateSessionId(),
        content: "Lista de itens limpa.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        type: "text",
      });
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.productList.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSingleChat.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        sendSingleChat.fulfilled,
        (state, action: PayloadAction<ChatResponse>) => {
          state.status = "succeeded";

          const data = action.payload;

          if (data.pdf_ready && data.download_url) {
            state.pdfUrl = `${API_BASE_URL}${data.download_url}`;
          }
          state.messages.push({
            id: generateSessionId(),
            content: action.payload.response,
            sender: "bot",
            timestamp: new Date().toISOString(),
            type: "text",
            options: action.payload.options,
          });
        },
      )
      .addCase(sendSingleChat.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Erro desconhecido.";
      })

      .addCase(fetchCurrentOrcamento.fulfilled, (state, action) => {
        state.productList = action.payload;
      })

      // --- extractProducts ---
      .addCase(extractProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.pdfUrl = null;
      })
      .addCase(
        extractProducts.fulfilled,
        (state, action: PayloadAction<ProductItem[]>) => {
          state.status = "succeeded";
          const newProducts = action.payload;

          newProducts.forEach((newP) => {
            const existingIndex = state.productList.findIndex(
              (p) => p.name.toLowerCase() === newP.name.toLowerCase(),
            );

            if (existingIndex !== -1) {
              state.productList[existingIndex].quantity += newP.quantity;
            } else {
              state.productList.push(newP);
            }
          });

          if (newProducts.length > 0) {
            state.messages.push({
              id: generateSessionId(),
              content: `✅ ${newProducts.length} item(ns) encontrado(s) e adicionado(s) à lista.`,
              sender: "bot",
              timestamp: new Date().toISOString(),
              type: "text",
            });
          } else {
            state.messages.push({
              id: generateSessionId(),
              content: `❌ Não consegui identificar produtos. Tente ser mais específico.`,
              sender: "bot",
              timestamp: new Date().toISOString(),
              type: "text",
            });
          }
        },
      )
      .addCase(extractProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error.message ||
          "Erro na extração de produtos.";
        state.messages.push({
          id: generateSessionId(),
          content: `⚠️ Erro na extração: ${state.error}`,
          sender: "bot",
          timestamp: new Date().toISOString(),
          type: "text",
        });
      })

      .addCase(generateMultipleQuote.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        generateMultipleQuote.fulfilled,
        (state, action: PayloadAction<ChatResponse>) => {
          state.status = "succeeded";
          state.messages.push({
            id: generateSessionId(),
            content: action.payload.response,
            sender: "bot",
            timestamp: new Date().toISOString(),
            type: "text",
          });
          state.productList = [];
        },
      )
      .addCase(generateMultipleQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error.message ||
          "Erro ao gerar orçamento múltiplo.";
        state.messages.push({
          id: generateSessionId(),
          content: `❌ Erro: ${state.error}`,
          sender: "bot",
          timestamp: new Date().toISOString(),
          type: "text",
        });
      });
  },
});

export const { setMode, addMessage, clearProductList, removeProduct } =
  chatSlice.actions;

export default chatSlice.reducer;
