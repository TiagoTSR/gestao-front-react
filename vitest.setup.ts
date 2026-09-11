import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock global do Next.js Navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

import React from 'react';

// Mock global do Next.js Link para evitar erro de navegação no JSDOM
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...rest }: any) =>
    React.createElement(
      'a',
      {
        href,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          onClick?.(e);
        },
        ...rest,
      },
      children
    ),
}));


