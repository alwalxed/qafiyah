'use client';

import type React from 'react';

import { ClientLayout } from '@/components/layout/client-layout';

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
