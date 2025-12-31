import { MapPinHouse } from 'lucide-react';
import React from 'react';
import { Card } from '../ui/card';

export default function AddressCard({ address }) {
  return (
    <Card className="p-6 relative [box-shadow:0px_10px_27px_0px_#0000001A]">
      {/* Truck Icon */}
      <div className="">
        <MapPinHouse className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
      </div>

      {/* Content - RTL aligned */}
      <div className="flex flex-col items-start gap-2 pr-0">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>

        {/* Phone */}
        <p className="text-sm text-gray-600" dir="ltr">
          الهاتف: {address.phone}
        </p>

        {/* Secondary Phone */}
        {address.secondaryPhone && (
          <p className="text-sm text-gray-600" dir="ltr">
            الرقم الاحتياطي: {address.secondaryPhone}
          </p>
        )}

        {/* Address */}
        <p className="text-sm text-gray-600 text-right">
          {address.fullAddress}
        </p>

        {/* Action Buttons */}
        <div className="flex self-end gap-4 mt-2">
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
            تعديل
          </button>
          <button className="text-sm text-red-500 hover:text-red-600 font-medium">
            حذف
          </button>
        </div>
      </div>
    </Card>
  );
}
