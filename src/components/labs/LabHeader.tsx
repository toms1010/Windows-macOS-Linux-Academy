import { ReactNode } from 'react';

interface LabHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** e.g. "Educational simulation — nothing runs on your machine" */
  badge?: string;
  /** e.g. "Beginner" | "Intermediate" */
  difficulty?: string;
  /** e.g. "10–15 min" */
  timeEstimate?: string;
  /** e.g. "CPU Scheduling" */
  topic?: string;
  /** Suggested first steps for the learner */
  tryList?: string[];
}

/** Shared header for all Interactive OS Lab modules. */
export default function LabHeader({ icon, title, description, badge, difficulty, timeEstimate, topic, tryList }: LabHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-4xl" aria-hidden="true">
          {icon}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
      </div>
      <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      {(difficulty || timeEstimate || topic) && (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5" aria-label="Lab metadata">
          {topic && (
            <span className="text-xs font-medium px-3 py-1 rounded-full glass">⚙️ {topic}</span>
          )}
          {difficulty && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
              {difficulty}
            </span>
          )}
          {timeEstimate && (
            <span className="text-xs font-medium px-3 py-1 rounded-full glass">⏱️ {timeEstimate}</span>
          )}
        </div>
      )}
      {badge && (
        <p className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          {badge}
        </p>
      )}
      {tryList && tryList.length > 0 && (
        <div className="mt-3 text-left glass rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            What to try
          </p>
          <ul className="text-sm space-y-0.5">
            {tryList.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold" aria-hidden="true">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
