import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import { Button } from '../components/ui/button';

export default function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: t('profile.personal_info'), component: ProfileForm },
    {
      id: 'password',
      label: t('profile.change_password'),
      component: ChangePasswordForm,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="p-4 md:p-10 [box-shadow:0px_10px_27px_0px_#0000001A]">
      <div className="mb-6 pb-4 border-b flex flex-wrap gap-2 justify-center">
        {tabs.map((tab, index) => (
          <Button
            size="lg"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 ${index === 0
              ? 'rounded-r'
              : index === tabs.length - 1
                ? 'rounded-l'
                : ''
              } ${activeTab === tab.id
                ? 'bg-secondary text-white'
                : 'bg-gray-200 text-secondary hover:bg-gray-300'
              }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {ActiveComponent && <ActiveComponent />}
    </div>
  );
}
