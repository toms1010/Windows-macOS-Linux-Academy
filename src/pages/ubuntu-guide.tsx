import { motion } from 'framer-motion';

export default function UbuntuGuide() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">Ubuntu Server Guide</h1>
      <div className="glass p-6 rounded-2xl">
        <ul className="list-disc list-inside space-y-2">
          <li>Installing Ubuntu Server</li>
          <li>Linux commands (ls, cd, etc.)</li>
          <li>SSH & Permissions</li>
          <li>Users, Groups, Networking</li>
          <li>Cron Jobs, systemctl, journalctl</li>
          <li>Firewall (UFW)</li>
          <li>Package Managers (apt, snap)</li>
          <li>Nginx, Docker, Node.js deployment</li>
          <li>PostgreSQL, Backups</li>
        </ul>
      </div>
    </motion.div>
  );
}
