import Head from 'next/head';
import { motion } from 'framer-motion';
import LabHeader from '@/components/labs/LabHeader';
import FilesystemExplorer from '@/components/labs/FilesystemExplorer';
import { FaFolderOpen } from 'react-icons/fa';

export default function FilesystemExplorerPage() {
  return (
    <>
      <Head>
        <title>Filesystem Explorer | Win vs Linux Academy</title>
        <meta
          name="description"
          content="Side-by-side interactive explorer of the Linux hierarchy, Windows drives, the Registry, and both security models."
        />
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <LabHeader
          icon={<FaFolderOpen className="text-green-500" />}
          title="Windows vs Linux Filesystem Explorer"
          description="Click any node to learn its purpose, typical contents, security model and the commands admins actually use there."
          topic="Filesystems"
          difficulty="Beginner"
          timeEstimate="5–10 min"
          tryList={[
            'Open /etc and C:\\Users side by side — where does each OS keep per-user config?',
            'Select the Registry node: why is it a database rather than “just another folder”?',
            'Read both security cards, then try the sticky bit hands-on in the Permissions Lab.',
          ]}
        />
        <FilesystemExplorer />
      </motion.div>
    </>
  );
}
