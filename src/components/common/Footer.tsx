export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 dark:border-white/5 mt-12 py-6 text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Windows vs Linux Academy. Built with ❤️ for learning.</p>
      </div>
    </footer>
  );
}
