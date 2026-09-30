import React, { useState } from 'react';
import { ExercisePhoto } from '../types/workout';
import { ImageIcon, Eye, Sparkles, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface ExercisePhotosGalleryProps {
  photos: ExercisePhoto[];
  exerciseName: string;
  compact?: boolean;
}

export const ExercisePhotosGallery: React.FC<ExercisePhotosGalleryProps> = ({
  photos,
  exerciseName,
  compact = false,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'side-by-side' | 'single'>(
    photos.length > 1 && !compact ? 'side-by-side' : 'single'
  );

  if (!photos || photos.length === 0) {
    return null;
  }

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="space-y-3">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Real Form Photographs ({photos.length} Stages)
          </span>
        </div>

        {/* View Mode Toggle if multiple photos */}
        {photos.length > 1 && !compact && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2 py-0.5 rounded transition-colors ${
                viewMode === 'side-by-side'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-2 py-0.5 rounded transition-colors ${
                viewMode === 'single'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Step View
            </button>
          </div>
        )}
      </div>

      {/* SIDE-BY-SIDE MODE */}
      {viewMode === 'side-by-side' && photos.length > 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {photos.map((photo, idx) => {
            const hasFailed = !!failedImages[idx];
            return (
              <div
                key={idx}
                className="group relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {!hasFailed ? (
                    <img
                      src={photo.url}
                      alt={`${exerciseName} - ${photo.label}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(idx)}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="p-4 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                      <span className="text-xs">{photo.label}</span>
                    </div>
                  )}

                  {/* Stage Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/90 backdrop-blur-md text-[10px] font-extrabold text-amber-400 border border-slate-700/80">
                    Step {idx + 1}: {idx === 0 ? 'Start / Setup' : 'Peak Contraction'}
                  </span>
                </div>

                {/* Caption Strip */}
                <div className="p-2.5 bg-slate-950 border-t border-slate-800/80">
                  <p className="text-xs text-slate-300 font-medium leading-snug">
                    {photo.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* SINGLE STEP / CAROUSEL MODE */
        <div className="space-y-2">
          {/* Active Image Card */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {!failedImages[activePhotoIndex] ? (
              <img
                src={photos[activePhotoIndex]?.url}
                alt={`${exerciseName} - ${photos[activePhotoIndex]?.label}`}
                referrerPolicy="no-referrer"
                onError={() => handleImageError(activePhotoIndex)}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            ) : (
              <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <ImageIcon className="w-10 h-10 text-slate-600" />
                <span className="text-xs">{photos[activePhotoIndex]?.label}</span>
              </div>
            )}

            {/* Navigation Overlay Buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-lg"
                  title="Previous position photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow-lg"
                  title="Next position photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Stage Badge */}
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-xs font-bold text-amber-400 border border-slate-700/80 shadow-md">
              Stage {activePhotoIndex + 1} of {photos.length}:{' '}
              {activePhotoIndex === 0 ? 'Starting Setup' : 'Peak Contraction'}
            </span>
          </div>

          {/* Bottom Step Indicator Buttons */}
          {photos.length > 1 && (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    activePhotoIndex === idx
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-[11px] uppercase tracking-wider text-slate-300">
                    Step {idx + 1}: {idx === 0 ? 'Start' : 'Contraction'}
                  </span>
                  <span className="truncate block text-slate-400 mt-0.5">{photo.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
