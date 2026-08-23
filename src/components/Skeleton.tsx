import { cn } from "../utils/lib";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/10 rounded-2xl border border-white/5 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  );
};

// Preset Skeletons for Website Layout & Sections

export const ProjectCardSkeleton = () => (
  <div className="bg-tertiary/60 p-5 rounded-3xl w-full border border-white/10 flex flex-col justify-between h-[420px] animate-pulse">
    <div>
      <Skeleton className="w-full h-[210px] rounded-2xl mb-4" />
      <Skeleton className="w-3/4 h-6 rounded-lg mb-3" />
      <Skeleton className="w-full h-4 rounded mb-2" />
      <Skeleton className="w-5/6 h-4 rounded mb-4" />
    </div>
    <div className="flex gap-2 pt-2 border-t border-white/5">
      <Skeleton className="w-16 h-5 rounded-full" />
      <Skeleton className="w-20 h-5 rounded-full" />
    </div>
  </div>
);

export const CategoryPillSkeleton = () => (
  <div className="flex items-center gap-3 py-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className="w-24 h-10 rounded-full shrink-0" />
    ))}
  </div>
);

export const ServiceCardSkeleton = () => (
  <div className="w-full sm:w-[250px] p-6 rounded-3xl bg-tertiary/40 border border-white/10 flex flex-col items-center justify-center gap-4 h-[280px]">
    <Skeleton className="w-16 h-16 rounded-2xl" />
    <Skeleton className="w-32 h-6 rounded-lg" />
  </div>
);

export const FeedbackCardSkeleton = () => (
  <div className="bg-black-200/60 p-8 rounded-3xl sm:w-[320px] w-full border border-white/10 flex flex-col justify-between h-[260px]">
    <Skeleton className="w-8 h-8 rounded-full mb-4" />
    <Skeleton className="w-full h-12 rounded-lg mb-6" />
    <div className="flex items-center justify-between border-t border-white/5 pt-4">
      <div className="space-y-2">
        <Skeleton className="w-28 h-4 rounded" />
        <Skeleton className="w-20 h-3 rounded" />
      </div>
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

export const DashboardStatCardSkeleton = () => (
  <div className="p-6 rounded-3xl bg-[#151030]/60 border border-white/5 flex items-center justify-between h-[110px]">
    <div className="space-y-3">
      <Skeleton className="w-24 h-3 rounded" />
      <Skeleton className="w-16 h-8 rounded-lg" />
      <Skeleton className="w-28 h-3 rounded" />
    </div>
    <Skeleton className="w-12 h-12 rounded-2xl" />
  </div>
);

export const ButtonSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn("w-32 h-11 rounded-2xl", className)} />
);

export const TableRowSkeleton = () => (
  <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between mb-3 border border-white/5">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-36 h-4 rounded" />
        <Skeleton className="w-24 h-3 rounded" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="w-9 h-9 rounded-xl" />
      <Skeleton className="w-9 h-9 rounded-xl" />
    </div>
  </div>
);

export default Skeleton;
