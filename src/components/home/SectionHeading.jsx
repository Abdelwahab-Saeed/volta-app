import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The heading every home section uses: small eyebrow label, title, optional subtitle, and an
 * optional "view all" link or custom controls on the end side.
 *
 * `tone="dark"` is for navy backgrounds. `align="center"` centres it (and drops the end slot).
 */
export default function SectionHeading({
    id,
    eyebrow,
    title,
    subtitle,
    action,
    children,
    tone = 'light',
    align = 'start',
    className,
}) {
    const dark = tone === 'dark';
    const centered = align === 'center';

    return (
        <div
            className={cn(
                'mb-8 md:mb-10 flex gap-4',
                centered ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-end sm:justify-between',
                className,
            )}
        >
            <div className={cn('max-w-2xl', centered && 'mx-auto')}>
                {eyebrow && (
                    <p
                        className={cn(
                            'mb-2 inline-flex items-center gap-2 text-xs md:text-sm font-bold tracking-wide',
                            dark ? 'text-secondary-on-dark' : 'text-secondary',
                        )}
                    >
                        <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-current" />
                        {eyebrow}
                    </p>
                )}
                <h2
                    id={id}
                    className={cn('text-2xl md:text-3xl lg:text-4xl font-black leading-tight', dark ? 'text-white' : 'text-primary')}
                >
                    {title}
                </h2>
                {subtitle && (
                    <p className={cn('mt-2 text-sm md:text-base leading-relaxed', dark ? 'text-white/75' : 'text-muted-foreground')}>
                        {subtitle}
                    </p>
                )}
            </div>

            {!centered && (action || children) && (
                <div className="flex shrink-0 items-center gap-3">
                    {action && (
                        <Link
                            to={action.to}
                            className={cn(
                                'group inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors',
                                dark
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-secondary hover:bg-secondary/10',
                            )}
                        >
                            {action.label}
                            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
                        </Link>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
}
