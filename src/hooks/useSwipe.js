import { useRef, useCallback } from 'react';

const THRESHOLD = 48; // px required to trigger swipe

/**
 * Returns event handlers for both touch and mouse drag swipe detection.
 * Attach the returned object to any container element via spread.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);
  const isDragging = useRef(false);

  /* ── Touch ──────────────────────────────────────────── */
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(delta) >= THRESHOLD) {
        delta < 0 ? onSwipeLeft?.() : onSwipeRight?.();
      }
      touchStartX.current = null;
    },
    [onSwipeLeft, onSwipeRight],
  );

  /* ── Mouse drag ─────────────────────────────────────── */
  const onMouseDown = useCallback((e) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  }, []);

  const onMouseUp = useCallback(
    (e) => {
      if (!isDragging.current || mouseStartX.current === null) return;
      const delta = e.clientX - mouseStartX.current;
      if (Math.abs(delta) >= THRESHOLD) {
        delta < 0 ? onSwipeLeft?.() : onSwipeRight?.();
      }
      mouseStartX.current = null;
      isDragging.current = false;
    },
    [onSwipeLeft, onSwipeRight],
  );

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    mouseStartX.current = null;
  }, []);

  return { onTouchStart, onTouchEnd, onMouseDown, onMouseUp, onMouseLeave };
}
