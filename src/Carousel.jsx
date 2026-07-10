import React, { useRef, useState, useCallback } from 'react';

// ============================================================================
// CAROUSEL — mobile swipe carousel (reactbits.dev-style snap track + dots)
// Native scroll-snap drives the motion so it feels exactly like a touch
// swipe with zero drag-math; the dot rail below just mirrors/steers it.
// ============================================================================

const Carousel = ({ items, renderItem, darkMode, cardWidth = '84vw', maxWidth = 340, gap = 16 }) => {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.firstChild) return;
    const cardW = track.firstChild.offsetWidth + gap;
    const idx = Math.round(track.scrollLeft / cardW);
    setActiveIdx((cur) => {
      const next = Math.max(0, Math.min(items.length - 1, idx));
      return next === cur ? cur : next;
    });
  }, [gap, items.length]);

  const scrollToIdx = (idx) => {
    const track = trackRef.current;
    const card = track?.children[idx];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ gap: `${gap}px`, scrollbarWidth: 'none', paddingInline: `calc((100% - min(${cardWidth}, ${maxWidth}px)) / 2)` }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="snap-center shrink-0"
            style={{ width: `min(${cardWidth}, ${maxWidth}px)` }}
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIdx
                  ? 'w-6 bg-purple-500'
                  : `w-1.5 ${darkMode ? 'bg-purple-500/20' : 'bg-purple-300/40'}`
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;