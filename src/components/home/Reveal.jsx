import useInView from '@/hooks/useInView';
import { cn } from '@/lib/utils';

/**
 * Fades its content up the first time it scrolls into view. The motion is CSS only (`.reveal` in
 * index.css) and is switched off for people who prefer reduced motion.
 */
export default function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
    const Tag = as;
    const [ref, inView] = useInView();

    return (
        <Tag
            ref={ref}
            className={cn('reveal', inView && 'is-visible', className)}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
            {...props}
        >
            {children}
        </Tag>
    );
}
