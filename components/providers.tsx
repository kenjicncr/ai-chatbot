'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { WagmiWithReactQueryProvider } from '@/lib/wagmi/wagmi-provider'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <WagmiWithReactQueryProvider>
      <SessionProvider basePath={process.env.NEXTAUTH_URL}>
        <NextThemesProvider {...props}>
          <SidebarProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SidebarProvider>
        </NextThemesProvider>
      </SessionProvider>
    </WagmiWithReactQueryProvider>
    
  )
}
