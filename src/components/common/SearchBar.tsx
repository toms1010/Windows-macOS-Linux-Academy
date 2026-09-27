import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ inputClassName = '' }: { inputClassName?: string }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${inputClassName ? 'w-full' : ''}`} role="search">
      <label htmlFor="site-search" className="sr-only">Search the academy</label>
      <input
        id="site-search"
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pl-3 pr-8 py-1.5 rounded-full glass border border-white/20 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-28 min-w-0 sm:w-40 md:w-48 ${inputClassName}`}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition p-1"
      >
        <FaSearch aria-hidden="true" />
      </button>
    </form>
  );
}
