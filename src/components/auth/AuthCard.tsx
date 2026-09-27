import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
}

/** Small centered card shared by login / signup / password pages. */
export default function AuthCard({ title, subtitle, children, footerText, footerLinkHref, footerLinkLabel }: AuthCardProps) {
  return (
    <div className="max-w-md mx-auto w-full">
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-white/10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary" aria-label="Win vs Linux Academy home">
            <span aria-hidden="true">🖥️</span> Win vs Linux
          </Link>
          <h1 className="text-2xl font-extrabold mt-3">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {children}
        <p className="text-sm text-center text-muted-foreground mt-5">
          {footerText}{' '}
          <Link href={footerLinkHref} className="text-primary hover:underline font-medium">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
