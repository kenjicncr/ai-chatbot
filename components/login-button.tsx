'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGitHub, IconSpinner } from '@/components/ui/icons'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { signIn, useSession, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'

import { injected } from 'wagmi/connectors'


interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean
  text?: string
}

export function LoginButton({
  text = 'Login with Metamask',
  showGithubIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const { connectAsync, error, data }= useConnect()
  const { address, chainId } = useAccount()
  const { signMessageAsync, isPending } = useSignMessage();

  const handleLogin = async () => {
    try {
      const connectedAccount = await connectAsync({ connector: injected() })
      const callbackUrl = '/protected'
      console.log( window.location.origin)
      const message = new SiweMessage({
        domain: window.location.host,
        address: connectedAccount.accounts[0],
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: connectedAccount.chainId,
        nonce: "01230s9dfk4",
      })

      const signature  = await signMessageAsync({
        message: message.prepareMessage(),
      })

      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl: `/`,
      })
    } catch (error) {
      window.alert(error)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={() => {
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        handleLogin()
      }}
      disabled={isPending}
      className={cn(className)}
      {...props}
    >
      {isPending ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showGithubIcon ? (
        <IconGitHub className="mr-2" />
      ) : null}
      {text}
    </Button>
  )
}
