import Head from 'next/head';
import { motion } from 'framer-motion';
import LabHeader from '@/components/labs/LabHeader';
import PermissionsLab from '@/components/labs/PermissionsLab';
import { FaLock } from 'react-icons/fa';

export default function PermissionsPage() {
  return (
    <>
      <Head>
        <title>Linux Permissions Lab | Win vs Linux Academy</title>
        <meta
          name="description"
          content="Interactive chmod calculator, symbolic mode, setuid/setgid/sticky bits, chown explorer and umask simulator."
        />
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <LabHeader
          icon={<FaLock className="text-yellow-500" />}
          title="Linux Permissions Lab"
          description="Master chmod, chown and umask hands-on. Everything here is simulated — no real files are touched."
          badge="Educational simulation — runs entirely in your browser"
          topic="Permissions & Ownership"
          difficulty="Beginner"
          timeEstimate="10–15 min"
          tryList={[
            'Toggle Owner / Group / Others boxes and watch the numeric and symbolic preview update.',
            'Compare chmod 755 with chmod u=rwx,g=rx,o=rx in the Symbolic tab.',
            'Enable the sticky bit and see how other-execute becomes “t”.',
            'Enter umask 077 and check what new files and directories would get.',
          ]}
        />
        <PermissionsLab />
      </motion.div>
    </>
  );
}
