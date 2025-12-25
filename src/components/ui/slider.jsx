import { useRef, useState } from 'react';
import { cn } from "@/lib/utils"

const Slider = ({
  value = [0, 100],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const railRef = useRef(null);

  const handleMouseDown = (index) => {
    setIsDragging(index);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleMouseMove = (e) => {
    if (isDragging === null || !railRef.current) return;

    const rect = railRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
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

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;

  return (
    <div
      className={cn("w-full", className)}
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
          className="absolute h-1.5 bg-blue-500 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            right: `${100 - getPercentage(value[1])}%`,
          }}
        />

        {/* Thumbs */}
        {value.map((val, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/4 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg"
            style={{
              left: `${getPercentage(val)}%`,
            }}
            onMouseDown={() => handleMouseDown(index)}
          />
        ))}
      </div>
    </div>
  );
};

export { Slider }
