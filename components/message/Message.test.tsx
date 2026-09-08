import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Message } from './Message';

describe('MessageComponent', () => {
  it('não deve exibir mensagem quando o erro for falso ou nulo', () => {
    const { container } = render(<Message error={false} text="Campo obrigatório" />);
    expect(container.firstChild).toBeNull();
  });

  it('não deve exibir mensagem se error for string vazia ou undefined', () => {
    const { container } = render(<Message error="" text="Campo obrigatório" />);
    expect(container.firstChild).toBeNull();
  });

  it('deve exibir mensagem quando error for verdadeiro', () => {
    render(<Message error={true} text="Nome é obrigatório" />);
    const msgElement = screen.getByText('Nome é obrigatório');
    expect(msgElement).toBeInTheDocument();
    expect(msgElement.closest('.app-message-error')).toBeInTheDocument();
  });
});
