
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { WagmiProvider } from 'wagmi'

import { config } from '@/lib/wagmi/create-config'
import { ReactNode } from 'react'

const queryClient = new QueryClient() 

export const WagmiWithReactQueryProvider = ({ children } : { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        {children} 
      </QueryClientProvider> 
    </WagmiProvider>
  )
}