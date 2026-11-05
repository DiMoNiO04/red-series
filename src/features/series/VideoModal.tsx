'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui-shadcn/dialog';
import { VideoJS } from '@/components/VideoJs';
import { useRouter, useSearchParams } from 'next/navigation';

type TEpisode = {
  title: string;
  videoUrl: string;
  number: number;
};

export function VideoModal({ episode, seriesSlug }: { episode: TEpisode; seriesSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('ep');
    const qs = params.toString();
    router.push(qs ? `?${qs}` : '?', { scroll: false });
  };

  return (
    <Dialog
      open
      onOpenChange={open => !open && close()}
    >
      <DialogContent className='max-w-7xl p-0 bg-black border-none'>
        <DialogTitle className='sr-only'>{episode.title}</DialogTitle>

        <VideoJS
          options={{
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
              {
                src: '/demo-cut.mp4',
                type: 'video/mp4',
              },
            ],
          }}
          onReady={player => {
            player.currentTime(2);

            const key = `progress:${seriesSlug}:${episode.number}`;
            const savedTime = localStorage.getItem(key);

            if (savedTime) {
              player.currentTime(parseFloat(savedTime));
            }

            player.on('timeupdate', () => {
              const current = player.currentTime();
              localStorage.setItem(key, String(current));
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
