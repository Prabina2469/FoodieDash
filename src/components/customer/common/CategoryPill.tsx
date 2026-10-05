import React from 'react';

interface CategoryPillProps {
  id: string;
  name: string;
  image: string;
  isSelected?: boolean;
  onClick: () => void;
  count?: string | number;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  name,
  image,
  isSelected = false,
  onClick,
  count
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 shrink-0 select-none ${
        isSelected
          ? 'bg-primary-fixed text-primary scale-105 shadow-sm ring-2 ring-primary'
          : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface ghost-border hover:scale-102 shadow-sm'
      }`}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-surface-container-low">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
        )}
      </div>
      <div className="text-center">
        <span className="block font-headline text-xs sm:text-sm font-bold tracking-tight line-clamp-1">
          {name}
        </span>
        {count !== undefined && (
          <span className="text-[10px] text-on-surface-variant font-label">
            {count} places
          </span>
        )}
      </div>
    </button>
  );
};
