import React, { useState } from 'react';
import AddressCard from '../components/address/AddressCard';
import { Button } from '../components/ui/button';
import AddressForm from '../components/address/AddressForm';

const addresses = [
  {
    id: 1,
    name: 'محمد ايمن',
    phone: '01098765432',
    secondaryPhone: '01156486537',
    fullAddress: 'العنوان: القاهرة - مصر الجديدة - شارع النزهة',
  },
  {
    id: 2,
    name: 'أحمد علي',
    phone: '01112345678',
    secondaryPhone: '01012345678',
    fullAddress: 'العنوان: الجيزة - المهندسين - شارع جامعة الدول العربية',
  },
];

export default function Address() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addressList, setAddressList] = useState(addresses);

  const handleAddAddress = (newAddress) => {
    setAddressList([...addressList, newAddress]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-5">
        {addressList.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
      <Button
        size="lg"
        className="mt-4 w-full max-w-md bg-secondary hover:bg-secondary/80 text-white text-lg rounded"
        onClick={() => setIsFormOpen(true)}
      >
        إضافة عنوان جديد
      </Button>

      {isFormOpen && (
        <AddressForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddAddress}
        />
      )}
    </div>
  );
}
