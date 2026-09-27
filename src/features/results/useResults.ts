import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { resultService } from './result.service';
import type { SaveAttemptInput, SaveStatus } from './result.types';

/**
 * Owns attempt persistence for a completed quiz run: saves exactly once per
 * unique answer set, exposes status for the results screen. Signed-out or
 * unconfigured backends resolve to 'skipped' — never an error state.
 */
export function useResults() {
  const { configured, user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const savedKey = useRef<string | null>(null);

  const save = useCallback(
    async (input: SaveAttemptInput, runKey: string) => {
      if (savedKey.current === runKey) return;
      savedKey.current = runKey;
      if (!configured || !user) {
        setSaveStatus('skipped');
        return;
      }
      setSaveStatus('saving');
      try {
        await resultService.saveAttempt(input);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('failed');
      }
    },
    [configured, user]
  );

  const reset = useCallback(() => {
    savedKey.current = null;
    setSaveStatus('idle');
  }, []);

  return { saveStatus, save, reset };
}
