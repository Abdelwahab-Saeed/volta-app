import WhiteLogo from '@/assets/Logo-04 2.png';

/**
 * Shown instead of the offer image when the admin didn't upload one: brand navy with a soft blue glow
 * and the white Volta logo (same identity as the footer). Fills its positioned parent.
 */
export default function OfferPlaceholder({ className = '' }) {
    return (
        <div className={`absolute inset-0 bg-primary overflow-hidden flex items-center justify-center ${className}`}>
            <div className="absolute -top-1/4 -end-1/4 w-3/4 h-3/4 rounded-full bg-secondary-on-dark/25 blur-3xl" />
            <div className="absolute -bottom-1/4 -start-1/4 w-2/3 h-2/3 rounded-full bg-secondary/20 blur-3xl" />
            <img src={WhiteLogo} alt="" aria-hidden="true" className="relative w-2/5 max-w-[220px] opacity-90 select-none" draggable="false" />
        </div>
    );
}
