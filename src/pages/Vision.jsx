import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Rocket, CheckCircle2, Award } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';

const Vision = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen">
            {/* Page Header */}
            <div className="relative py-20 bg-[#1e2749] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                        {t('vision_page.title')}
                    </h1>
                    <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
                </div>
            </div>

            {/* Vision Statement */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                        <div className="flex-1 text-center md:text-right">
                            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                                <Target size={18} />
                                {t('vision_page.vision.title').toUpperCase()}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                                {t('vision_page.vision.text')}
                            </h2>
                        </div>
                        <div className="flex-1 bg-white p-2 rounded-2xl shadow-2xl skew-y-2">
                            <SafeImage
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                alt="Vision"
                                className="rounded-xl w-full h-[300px] object-cover -skew-y-2"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-8">
                                <Rocket size={24} />
                                {t('vision_page.mission.title').toUpperCase()}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-10 leading-relaxed">
                                {t('vision_page.mission.text')}
                            </h2>
                            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Vision;
