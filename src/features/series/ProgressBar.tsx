'use client';

type TProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: TProgressBarProps) {
  const p = Math.min(Math.max(progress, 0), 100) * 100;

  return (
    <>
      <div className='absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-full' />

      {p > 0 && (
        <div
          className='absolute bottom-0 left-0 h-1 bg-red-600 rounded-lg'
          style={{ width: `${p}%`, minWidth: '4px' }}
        />
      )}
    </>
  );
}
