import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CanvasKitProvider } from '../context/useCanvasKit'

function MyApp({ Component, pageProps }: AppProps) {
  return <CanvasKitProvider><Component {...pageProps} /></CanvasKitProvider>
}

export default MyApp
