import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';

const AboutUs = () => {
    const { t } = useTranslation();

    const iconMap = [
        <ShieldCheck className="text-secondary" size={40} />,
        <Zap className="text-secondary" size={40} />,
        <Users className="text-secondary" size={40} />,
        <TrendingUp className="text-secondary" size={40} />,
        <Zap className="text-secondary" size={40} />,
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-primary text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t('about_us.title')}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed">
                        {t('about_us.description')}
                    </p>
                </div>
            </div>

            {/* Vision & Mission Summary */}
            <div className="container mx-auto px-4 -mt-10 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="bg-secondary/10 p-2 rounded-lg">
                                <TrendingUp className="text-secondary" size={24} />
                            </span>
                            {t('about_us.vision_title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {t('about_us.vision_text')}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="bg-secondary/10 p-2 rounded-lg">
                                <ShieldCheck className="text-secondary" size={24} />
                            </span>
                            {t('about_us.mission_title')}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {t('about_us.mission_text')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Goals Section */}
            <div className="container mx-auto px-4 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-4">
                        {t('about_us.goals_title')}
                    </h2>
                    <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t('about_us.goals', { returnObjects: true }).map((goal, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex items-start gap-4">
                            <div className="bg-primary/5 p-3 rounded-full flex-shrink-0">
                                {iconMap[index] || <ShieldCheck className="text-secondary" size={24} />}
                            </div>
                            <p className="text-gray-800 font-medium pt-1">
                                {goal}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
