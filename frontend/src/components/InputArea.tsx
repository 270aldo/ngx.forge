import React, { useState, FormEvent } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function InputArea({ onSendMessage, placeholder = "Type a message...", isLoading = false }: Props) {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" || isLoading) return;
    
    onSendMessage(message);
    setMessage("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Glowing background effect */}
      <div className="absolute left-1/2 bottom-0 w-2/3 h-[50%] -translate-x-1/2 bg-[var(--accent-primary)] blur-[80px] opacity-10 pointer-events-none"></div>
      
      <div className="flex items-end relative">
        {/* Attachment button - mejor alineado */}
        <button
          type="button"
          className="mr-2 h-10 w-10 rounded-xl flex items-center justify-center bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors self-center border border-[var(--border)] shadow-sm"
          title="Attach files"
        >
          <span className="material-icons-outlined text-sm">
            attach_file
          </span>
        </button>
        
        <div className="flex-1 relative">
          {/* Geometric pattern decoration */}
          <div className="absolute -left-1 -right-1 -top-1 -bottom-1 rounded-xl overflow-hidden pointer-events-none z-0 opacity-50">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary-transparent)] to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary-transparent)] to-transparent"></div>
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--accent-primary-transparent)] to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--accent-primary-transparent)] to-transparent"></div>
          </div>
          
          {/* Textbox with futuristic design */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className="w-full p-3 px-4 pr-20 resize-none rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-shadow relative z-10"
            style={{
              minHeight: "50px",
              maxHeight: "150px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
          />
          
          {/* Control buttons */}
          <div className="absolute right-2 bottom-[10px] flex items-center space-x-1 z-20">
            {/* Microphone button */}
            <button 
              type="button" 
              className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              title="Voice input"
            >
              <span className="material-icons-outlined text-sm">
                mic
              </span>
            </button>
            
            {/* Send button */}
            <button 
              type="submit" 
              className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-[0_0_10px_var(--glow)] opacity-80 hover:opacity-100 transition-opacity"
              disabled={!message.trim() || isLoading}
            >
              <span className="material-icons-outlined text-sm">
                send
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
