import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { PostData } from '@/lib/features/posts/posts.slice';
import { calcDateToNow } from '@/lib/utils';
import { Post, Tag } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function PostPreview({ post }: { post: PostData }) {
  const creationDate = calcDateToNow(post.createdAt);
  return (
    <Link href={`/posts/${post.id}`}>
      <div
        key={post.id}
        className="h-[450px] flex flex-col group relative overflow-hidden rounded-lg border"
      >
        <div className="relative w-full min-h-60 overflow-hidden">
          <Image
            src="/medium-thumbnail.png"
            alt={post.title}
            fill
            className="object-cover w-full h-full transition-opacity group-hover:opacity-80"
          />
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-4">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.name} className="bg-[#FABC3F]">
                {tag.name}
              </Badge>
            ))}
            {post.tags.length >= 3 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge variant="secondary" className="hover:bg-slate-300">
                    more
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="">
                  <div className="flex justify-between space-x-4">
                    <div className="">
                      <h4 className="text-sm font-semibold">Remaining tags</h4>
                      <div className="flex flex-wrap gap-1 mt-4">
                        {post.tags.slice(3).map((tag) => (
                          <Badge key={tag.name} className="bg-[#FABC3F]">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>
        <div className="flex justify-between px-3 py-1">
          <span className='text-sm font-normal text-muted-foreground'>By {post.author?.username ?? 'unknown'}</span>
          <p className="text-sm text-muted-foreground">
            {creationDate}
          </p>
        </div>
      </div>
    </Link>
  );
}
