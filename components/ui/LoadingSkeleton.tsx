'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-800/60', className)}
      {...props}
    />
  );
}

export function MicroCardSkeleton() {
  return (
    <div className="glass-card p-3.5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function ItineraryTimelineSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 items-center">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-16 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
