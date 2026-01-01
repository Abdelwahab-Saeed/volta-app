import React, { useState } from 'react';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import { Button } from '../components/ui/button';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'الملف الشخصي', component: ProfileForm },
    {
      id: 'password',
      label: 'تغيير كلمة المرور',
      component: ChangePasswordForm,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="p-10 [box-shadow:0px_10px_27px_0px_#0000001A]">
      <div className="mb-6  pb-4 border-b" dir="rtl">
        {tabs.map((tab, index) => (
          <Button
            size="lg"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 ${
              index === 0
                ? 'rounded-r'
                : index === tabs.length - 1
                ? 'rounded-l'
                : ''
            } ${
              activeTab === tab.id
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
