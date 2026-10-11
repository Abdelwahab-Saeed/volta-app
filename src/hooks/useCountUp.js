import { useEffect, useState } from 'react';

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Counts from 0 to `target` once `start` turns true (ease-out, so it slows into the final number).
 * Returns the target straight away when `animate` is false, e.g. for prefers-reduced-motion.
 */
export default function useCountUp(target, { start = true, animate = true, duration = 1800, delay = 0 } = {}) {
  const [value, setValue] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate || !start) return undefined;

    let frame;
    let startedAt = null;
    const tick = (now) => {
      if (startedAt === null) startedAt = now + delay;
      const progress = Math.min(Math.max((now - startedAt) / duration, 0), 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, animate, duration, delay]);

  return animate ? value : target;
}
