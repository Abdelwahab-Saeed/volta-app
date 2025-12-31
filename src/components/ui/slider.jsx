import { useRef, useState } from 'react';
import { cn } from "@/lib/utils"

const Slider = ({
  value = [0, 100],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  dir = 'ltr',
  className,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const railRef = useRef(null);
  const isRtl = dir === 'rtl';

  const handleMouseDown = (index) => {
    setIsDragging(index);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleMouseMove = (e) => {
    if (isDragging === null || !railRef.current) return;

    const rect = railRef.current.getBoundingClientRect();
    let percentage = (e.clientX - rect.left) / rect.width;
    if (isRtl) {
      percentage = 1 - percentage;
    }

    const newValue = Math.round((percentage * (max - min) + min) / step) * step;
    const clampedValue = Math.max(min, Math.min(max, newValue));

    const newValues = [...value];
    newValues[isDragging] = clampedValue;

    // Prevent thumbs from crossing
    if (isDragging === 0 && newValues[0] <= newValues[1]) {
      onValueChange?.(newValues);
    } else if (isDragging === 1 && newValues[1] >= newValues[0]) {
      onValueChange?.(newValues);
    }
  };

  const getPercentage = (val) => {
    const percentage = ((val - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };


  return (
    <div
      className={cn("w-full touch-none select-none flex items-center", className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...props}
    >
      <div
        ref={railRef}
        className="relative h-1.5 w-full bg-slate-200 rounded-full cursor-pointer"
      >
        {/* Track Active */}
        <div
          className="absolute h-1.5 bg-[#31A0D3] rounded-full"
          style={{
            left: isRtl ? 'auto' : `${getPercentage(value[0])}%`,
            right: isRtl ? `${getPercentage(value[0])}%` : 'auto',
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`,
          }}
        />

        {/* Thumbs */}
        {value.map((val, index) => (
          <div
            key={index}
            className="absolute mt-2 w-5 h-5 bg-[#31A0D3] rounded-full transform -translate-y-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-sm"
            style={{
              left: isRtl ? 'auto' : `${getPercentage(val)}%`,
              right: isRtl ? `${getPercentage(val)}%` : 'auto',
              top: '50%',
              transform: `translate(${isRtl ? '50%' : '-50%'}, -50%)`
            }}
            onMouseDown={() => handleMouseDown(index)}
          />
        ))}
      </div>
    </div>
  );
};

export { Slider }
