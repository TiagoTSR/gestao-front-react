'use client';

import React from 'react';

export interface MessageProps {
  error?: boolean | string | null;
  text: string;
}

export function Message({ error, text }: MessageProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="app-message-error flex align-items-center gap-1 mt-1 text-xs">
      <i className="pi pi-times-circle"></i>
      <span>{text}</span>
    </div>
  );
}

// Alias para compatibilidade
export { Message as MessageComponent };
