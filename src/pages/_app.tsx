import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/common/Layout';
import { AuthProvider } from '@/features/auth/useAuth';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
