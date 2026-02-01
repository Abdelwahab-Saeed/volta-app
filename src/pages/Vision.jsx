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
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                                <Target size={18} />
                                {t('vision_page.vision.title').toUpperCase()}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
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
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                                <Rocket size={18} />
                                {t('vision_page.mission.title').toUpperCase()}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {t('vision_page.mission.text')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {t('vision_page.mission.items', { returnObjects: true }).map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl border-s-4 border-secondary shadow-sm">
                                    <CheckCircle2 className="text-secondary flex-shrink-0" size={24} />
                                    <span className="text-gray-800 font-semibold">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-primary text-white p-8 rounded-2xl text-center shadow-xl">
                            <p className="text-xl font-medium italic">
                                "{t('vision_page.mission.commitment')}"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Goals Section */}
            <section className="py-20 bg-[#1e2749] text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                        <Award size={18} />
                        {t('vision_page.goals.title').toUpperCase()}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
                        {t('vision_page.goals.items', { returnObjects: true }).map((goal, index) => (
                            <div key={index} className="group p-8 rounded-2xl border border-white/10 hover:border-secondary/50 hover:bg-white/5 transition-all duration-300">
                                <div className="text-secondary text-5xl font-black mb-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <p className="text-xl font-semibold leading-relaxed">
                                    {goal}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Vision;
