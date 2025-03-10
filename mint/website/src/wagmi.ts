import { http, createConfig } from '@wagmi/vue'
import { sepolia } from '@wagmi/vue/chains'

export const config = createConfig({
  chains: [sepolia],
  connectors: [],
  transports: {
    [sepolia.id]: http(),
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
