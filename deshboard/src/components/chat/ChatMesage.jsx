import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bot, User } from "lucide-react";

// Function to parse and format AI response
const formatBotMessage = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-3 ml-0">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      flushList();
      return;
    }

    // Check for headings (lines ending with : or !)
    if ((trimmedLine.endsWith(':') || trimmedLine.endsWith('!')) && 
        trimmedLine.length < 80 && 
        !trimmedLine.includes('$') &&
        !trimmedLine.startsWith('*') &&
        !trimmedLine.startsWith('-') &&
        !trimmedLine.startsWith('•')) {
      flushList();
      elements.push(
        <p key={`h-${index}`} className="font-semibold text-[15px] mt-1 mb-2 text-gray-900 dark:text-gray-100">
          {trimmedLine}
        </p>
      );
    }
    // Check for bullet points (*, -, •) or numbered lists
    else if (/^[*\-•]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine)) {
      const content = trimmedLine.replace(/^[*\-•]\s*●?\s*/, '').replace(/^\d+\.\s/, '');
      listItems.push(
        <li key={`li-${index}`} className="flex items-start gap-2 text-gray-800 dark:text-gray-200">
          <span className="text-gray-500 dark:text-gray-400 mt-0.5 shrink-0 text-sm">•</span>
          <span className="flex-1 text-[14px] leading-relaxed">{parseInlineFormatting(content)}</span>
        </li>
      );
    }
    // Regular paragraph
    else {
      flushList();
      elements.push(
        <p key={`p-${index}`} className="mb-2 leading-relaxed text-[14px] text-gray-800 dark:text-gray-200">
          {parseInlineFormatting(trimmedLine)}
        </p>
      );
    }
  });

  flushList();
  return <div className="text-left">{elements}</div>;
};

// Parse inline formatting (bold text and prices)
const parseInlineFormatting = (text) => {
  const parts = [];
  let lastIndex = 0;

  // Match bold (**text**) and prices
  const regex = /(\*\*[^*]+\*\*|(?:Price|price|₹|Rs\.?|INR)\s*:?\s*[₹$]?\s*\d+(?:[,.\d]*)?)/gi;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const matchedText = match[0];

    // Check if it's bold text
    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      const boldText = matchedText.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-semibold text-gray-900 dark:text-white">
          {boldText}
        </strong>
      );
    }
    // Check if it's a price
    else if (/(?:Price|price|₹|Rs\.?|INR)/i.test(matchedText)) {
      // Extract just the number
      const priceMatch = matchedText.match(/[₹$]?\s*(\d+(?:[,.\d]*)?)/);
      if (priceMatch) {
        parts.push(
          <span 
            key={match.index}
            className="text-gray-800 dark:text-gray-200"
          >
            Price: ${priceMatch[1]}
          </span>
        );
      } else {
        parts.push(matchedText);
      }
    } else {
      parts.push(matchedText);
    }

    lastIndex = match.index + matchedText.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export function ChatMessage({ message }) {
  const isBot = message.isBot;
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex items-start gap-3 ${
        isBot ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <Avatar className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700">
        <AvatarFallback className={isBot ? "bg-gray-700 dark:bg-gray-800" : "bg-green-500 dark:bg-green-600"}>
          {isBot ? (
            <Bot className="h-4 w-4 text-white" />
          ) : (
            <User className="h-4 w-4 text-white" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col ${
          isBot ? "items-start max-w-[85%]" : "items-end max-w-[75%]"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? "bg-gray-800 dark:bg-gray-850 text-gray-100 dark:text-gray-200 rounded-tl-none border border-gray-700"
              : "bg-green-500 text-white rounded-tr-none"
          }`}
        >
          {isBot ? (
            <div className="text-sm leading-relaxed">
              {formatBotMessage(message.content)}
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>
        {time && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
            {time}
          </span>
        )}
      </div>
    </div>
  );
}