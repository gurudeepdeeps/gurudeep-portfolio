import React from "react";
import { FolderSearch, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items found",
  description = "There are no records matching your current filter criteria.",
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center rounded-3xl bg-tertiary/40 border border-white/5 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
        {icon || <FolderSearch size={28} />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-all hover:scale-105"
        >
          <RefreshCw size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
