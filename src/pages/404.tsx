import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16 space-y-4"
    >
      <p className="text-7xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        The page you are looking for does not exist or was moved. Try the
        homepage or one of the learning sections instead.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"
        >
          Go home
        </Link>
        <Link
          href="/os-overview"
          className="px-6 py-2 glass rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition"
        >
          OS overview
        </Link>
      </div>
    </motion.div>
  );
}
