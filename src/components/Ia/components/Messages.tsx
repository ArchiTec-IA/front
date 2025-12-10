import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { getInitials } from "@/lib/utils";
import { CheckCheck, Copy } from "lucide-react";
import type { Message } from "@/store/chatSlice";

type MessagesComponentsProps = {
  formatTime: (isoDate: string) => string;
  copyToClipboard: (content: string, messageId: string) => Promise<void>;
  copiedId?: string | null;
  messages?: Message[];
};

const formatMessageContent = (text: string) => {
  text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  text = text.replace(/\n/g, "<br>");

  const tableRegex = /\|(.+?)\|[\s\n]*\|(---+\|)+[\s\n]*((?:\|.+\|[\s\n]*)*)/g;

  text = text.replace(tableRegex, (header, rows) => {
    const headers = header
      .split("|")
      .map((h: string) => h.trim())
      .filter((h: string) => h);
    const rowsArray = rows
      .trim()
      .split("\n")
      .map((row: string) =>
        row
          .split("|")
          .map((cell: string) => cell.trim())
          .filter((cell: string) => cell)
      )
      .filter((row: string[]) => row.length > 0);

    let tableHTML =
      '<table class="message-table w-full border-collapse my-3 text-sm"><thead><tr>';
    headers.forEach((h: string) => {
      tableHTML += `<th class="border p-2 bg-gray-200 dark:bg-gray-600 text-left font-semibold">${h}</th>`;
    });
    tableHTML += "</tr></thead><tbody>";

    rowsArray.forEach((row: string[]) => {
      const isTotalRow = row.some(
        (cell: string) =>
          cell.toLowerCase().includes("total") ||
          cell.toLowerCase().includes("valor total")
      );
      tableHTML += `<tr class="${
        isTotalRow
          ? "font-bold bg-gray-100 dark:bg-gray-700"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }">`;
      row.forEach((cell: string) => {
        tableHTML += `<td class="border p-2">${cell}</td>`;
      });
      tableHTML += "</tr>";
    });

    tableHTML += "</tbody></table>";

    return tableHTML;
  });

  return <div dangerouslySetInnerHTML={{ __html: text }} />;
};

export function MessagesComponent(props: MessagesComponentsProps) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="p-6 flex flex-col gap-6">
      {props.messages &&
        props.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              // Ajustar de role para sender
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                message.sender === "user" ? "bg-green-300" : "bg-blue-300"
              }`}
            >
              <AvatarFallback className="text-slate-600 font-bold mt-1 bg-transparent h-full w-full flex items-center justify-center">
                {message.sender === "user" ? getInitials(user?.name) : "AI"}
              </AvatarFallback>
            </Avatar>

            <div
              className={`flex-1 space-y-2 ${
                message.sender === "user" ? "max-w-[80%]" : "max-w-[80%]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">
                  {message.sender === "user" ? `${user?.name}` : "QuioAI"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {props.formatTime(message.timestamp)}
                </span>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  message.sender === "user" ? "bg-green-200" : "bg-blue-200"
                }`}
              >
                {/* Usar a função de formatação */}
                {formatMessageContent(message.content)}
              </div>

              {message.sender === "bot" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() =>
                    props.copyToClipboard(message.content, message.id)
                  }
                >
                  {props.copiedId === message.id ? (
                    <CheckCheck className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {props.copiedId === message.id ? "Copiado!" : "Copiar"}
                </Button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
