// src/app/layout.tsx
import React from 'react';
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry'; // Adjust path if needed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
