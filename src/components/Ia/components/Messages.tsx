import { QuioIcon, UserIcon } from "@/assets/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  selectChatOption,
  type ChatOption,
  type Message,
} from "@/store/chatSlice";
import AudioMessage from "./AudioMessage";
import { Button } from "@/components/ui/button";

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
          .filter((cell: string) => cell),
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
          cell.toLowerCase().includes("valor total"),
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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { sessionId, mode } = useAppSelector((state) => state.chat);

  return (
    <div className="p-6 flex flex-col gap-6">
      {props.messages &&
        props.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                message.sender === "user"
                  ? "bg-chat-foreground"
                  : "bg-chat-foreground"
              }`}
            >
              <AvatarFallback className="text-muted font-medium bg-transparent h-full w-full flex items-center justify-center">
                {message.sender === "user" ? (
                  <UserIcon width="24" height="24" />
                ) : (
                  <QuioIcon width="24" height="24" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className={`flex-1 space-y-2 max-w-[80%]`}>
              <div
                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <span className={`text-sm font-bold text-chat-foreground`}>
                  {message.sender === "user" ? `${user?.name}` : "QuioAI"}
                </span>
                <span className={`text-xs text-muted-foreground`}>
                  {props.formatTime(message.timestamp)}
                </span>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  message.sender === "user"
                    ? "bg-chat text-foreground"
                    : "bg-chat-foreground text-sidebar"
                } ${message.type === "audio" ? "bg-transparent" : ""} `}
              >
                {message.type === "audio" ? (
                  <AudioMessage src={message.content} />
                ) : (
                  formatMessageContent(message.content)
                )}
              </div>

              {/* Lógica das Opções (Botões) */}
              {message.sender === "bot" &&
                message.options &&
                message.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-chat/20">
                    {message.options.map((option: ChatOption) => (
                      <Button
                        key={option.id}
                        onClick={() => {
                          dispatch(
                            selectChatOption({
                              label: option.id,
                              sessionId,
                              mode,
                            }),
                          );
                        }}
                        className="px-4 py-1.5 text-xs font-medium rounded-full border border-chat bg-sidebar-primary text-foreground hover:bg-background hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
    </div>
  );
}
