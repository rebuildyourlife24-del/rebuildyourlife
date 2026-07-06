import { prisma } from '@rebuildyourlife/database';
import { Video } from 'lucide-react';
import ViralFactoryUI from './ViralFactoryUI';
import { getSessionAction } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function ViralFactoryPage() {
  const session = await getSessionAction();
  if (!session?.success || !session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch existing drafts (SocialMediaPosts where platform is TIKTOK, REELS, etc)
  const drafts = await prisma.socialMediaPost.findMany({
    where: {
      userId: session.user.id,
      platform: { in: ['TIKTOK', 'INSTAGRAM_REEL', 'YOUTUBE_SHORT'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
          <Video className="w-8 h-8 text-cyan-500" />
          Viral Video Factory
        </h1>
        <p className="text-zinc-400 font-mono text-sm">Genereer onbeperkt scripts en voiceovers voor organische traffic via short-form content.</p>
      </div>

      <ViralFactoryUI initialDrafts={drafts} />
    </div>
  );
}
