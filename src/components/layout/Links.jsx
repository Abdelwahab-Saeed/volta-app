import { PhoneCall, Facebook, MessageCircleMore, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Links() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const links = [
        {
            href: "tel:+201111126804",
            icon: <PhoneCall size={24} />,
            ariaLabel: t('layout.call_us'),
            color: "bg-secondary"
        },
        {
            href: "https://wa.me/+201222245464",
            target: "_blank",
            rel: "noreferrer",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            ariaLabel: t('layout.whatsapp_us'),
            color: "bg-[#25D366]"
        },
        {
            href: "https://facebook.com",
            target: "_blank",
            rel: "noreferrer",
            icon: <Facebook size={24} />,
            ariaLabel: t('layout.follow_facebook'),
            color: "bg-[#3B5998]"
        }
    ];

    return (
        <div className="fixed bottom-20 right-8 z-50 flex items-center justify-center">
            {/* Backdrop for easier closing if needed, or just let them click the X */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/5 z-[-1]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Items */}
            <div className="relative flex items-center justify-center">
                {links.map((link, index) => {
                    // Circular positioning logic
                    // We'll place them in an arc or half-circle
                    const angle = (index * 45) + 135; // Start from top-left-ish
                    const radius = 80; // Distance from center
                    const x = isOpen ? radius * Math.cos((angle * Math.PI) / 180) : 0;
                    const y = isOpen ? radius * Math.sin((angle * Math.PI) / 180) : 0;

                    return (
                        <a
                            key={index}
                            href={link.href}
                            target={link.target}
                            rel={link.rel}
                            aria-label={link.ariaLabel}
                            style={{
                                transform: `translate(${x}px, ${y}px) scale(${isOpen ? 1 : 0})`,
                                transitionDelay: `${isOpen ? index * 50 : 0}ms`,
                                transitionProperty: 'transform, opacity',
                            }}
                            className={`absolute w-12 h-12 ${link.color} text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 ease-out z-10 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                                }`}
                        >
                            {link.icon}
                        </a>
                    );
                })}

                {/* Main Trigger Button */}
                <button
                    onClick={toggleMenu}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-20 ${isOpen ? 'bg-red-500 rotate-90 scale-110' : 'bg-secondary hover:scale-110'
                        } text-white`}
                    aria-label="Toggle contact menu"
                >
                    {isOpen ? <X size={28} /> : <MessageCircleMore size={28} />}
                </button>
            </div>
        </div>
    );
}