"use client";

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: string;
}

export function Skeleton({ className = "", width, height, rounded = "rounded-xl" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded="rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton height={14} width="60%" />
          <Skeleton height={10} width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton width={28} height={28} rounded="rounded-full" />
            <Skeleton height={12} width={`${50 + i * 10}%`} />
            <Skeleton height={12} width={30} className="ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton width={24} height={24} rounded="rounded-full" />
          <Skeleton width={36} height={36} rounded="rounded-xl" />
          <Skeleton height={12} width={`${30 + (i % 3) * 10}%`} />
          <Skeleton height={12} width={40} className="ml-auto" />
          <Skeleton height={12} width={32} />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <Skeleton height={10} width={80} />
      <Skeleton height={28} width={60} />
      <Skeleton height={8} width="70%" />
    </div>
  );
}
