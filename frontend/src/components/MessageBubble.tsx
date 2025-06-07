import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Props {
  message: Message;
}

export const MessageBubble = ({ message }: Props) => {
  const isUser = message.sender === "user";
  
  return (
    <div 
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar for assistant message */}
      {!isUser && (
        <div className="h-8 w-8 rounded mr-2 flex-shrink-0 overflow-hidden relative self-end mb-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary-transparent)] to-[var(--accent-secondary-transparent)] rounded-md rotate-45 transform scale-75"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons-outlined text-[var(--accent-primary)] text-sm">smart_toy</span>
          </div>
        </div>
      )}
      
      <div 
        className={`
          relative 
          max-w-[80%] 
          p-5 
          ${isUser ? 
            'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white' : 
            'bg-[var(--bg-secondary)] text-[var(--text-primary)]'}
          ${isUser ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}
          shadow-lg
        `}
        style={{
          boxShadow: isUser ? 
            '0 8px 16px -8px var(--accent-primary-shadow), 0 0 0 1px var(--accent-primary-border)' : 
            '0 8px 16px -8px var(--shadow-color), 0 0 0 1px var(--border-transparent)'
        }}
      >
        {/* Glowing border effect for assistant messages */}
        {!isUser && (
          <div className="absolute inset-0 rounded-2xl rounded-tl-sm overflow-hidden">
            <div className="absolute inset-0 border border-[var(--border)] rounded-2xl rounded-tl-sm"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary-transparent)] to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--border-highlight)] to-transparent"></div>
          </div>
        )}
        
        {/* Message Content with Markdown Support */}
        <div className={`prose max-w-none ${isUser ? 'prose-invert' : 'prose-invert'}`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Timestamp with improved styling */}
        <div className={`flex items-center text-xs mt-3 ${isUser ? 'text-white opacity-70 justify-end' : 'text-[var(--text-tertiary)] justify-end'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          
          {/* Delivery status for user messages */}
          {isUser && (
            <span className="material-icons-outlined text-xs ml-1">done_all</span>
          )}
        </div>
        
        {/* Decorative element - simplified */}
        {!isUser && (
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[var(--accent-primary)] rounded-full"></div>
        )}
      </div>
      
      {/* Avatar for user message */}
      {isUser && (
        <div className="h-8 w-8 rounded ml-2 flex-shrink-0 overflow-hidden relative self-end mb-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons-outlined text-white text-sm">person</span>
          </div>
        </div>
      )}
    </div>
  );
};
