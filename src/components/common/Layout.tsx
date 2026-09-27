import { ReactNode, useState } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar, { SidebarDrawer } from './Sidebar';
import BackToTop from './BackToTop';
import ScrollProgress from './ScrollProgress';

export default function Layout({ children }: { children: ReactNode }) {
  // Single source of truth for the mobile/tablet navigation menu.
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col overflow-x-clip">
      <Head>
        <title>Windows vs Linux Academy</title>
        <meta
          name="description"
          content="Master Windows, macOS, Linux, kernels, and backend engineering with interactive lessons, comparisons, and quizzes."
        />
      </Head>
      <ScrollProgress />
      <Navbar
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
      />
      <SidebarDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          {children}
        </main>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
