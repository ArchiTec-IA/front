import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type ChatMode = "single" | "multiple";

export interface ProductItem {
  name: string;
  quantity: number;
  price: number;
  dimensions?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  type: "text" | "audio";
}

interface ChatResponse {
  response: string;
  pdf_url: string | null;
  session_id: string;
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

const API_BASE_URL = "http://quio-alb-25446701.us-east-2.elb.amazonaws.com/";
const generateSessionId = () =>
  "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

export const sendSingleChat = createAsyncThunk<
  ChatResponse,
  { message: string; sessionId: string; mode: ChatMode },
  { rejectValue: string }
>(
  "chat/sendSingleChat",
  async ({ message, sessionId }, { rejectWithValue }) => {
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
  { rejectValue: string }
>(
  "chat/generateMultipleQuote",
  async ({ products, sessionId }, { rejectWithValue }) => {
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
          state.messages.push({
            id: generateSessionId(),
            content: action.payload.response,
            sender: "bot",
            timestamp: new Date().toISOString(),
            type: "text",
          });
          state.pdfUrl = action.payload.pdf_url;
        },
      )
      .addCase(sendSingleChat.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Erro desconhecido.";
        state.messages.push({
          id: generateSessionId(),
          content: `❌ Erro: ${state.error}`,
          sender: "bot",
          timestamp: new Date().toISOString(),
          type: "text",
        });
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
          state.pdfUrl = action.payload.pdf_url;
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
