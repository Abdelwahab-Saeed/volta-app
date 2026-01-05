import { MapPinHouse, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { Card } from '../ui/card';

export default function AddressCard({ address, onEdit, onDelete }) {
  return (
    <Card className="p-6 relative [box-shadow:0px_10px_27px_0px_#0000001A]">
      {/* Truck Icon */}
      <div className="">
        <MapPinHouse className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
      </div>

      {/* Content - RTL aligned */}
      <div className="flex flex-col items-start gap-2 pr-0">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900">{address.recipient_name}</h3>

        {/* Phone */}
        <p className="text-sm text-gray-600" dir="ltr">
          الهاتف: {address.phone_number}
        </p>

        {/* Address */}
        <p className="text-sm text-gray-600 text-right">
          {address.state} - {address.city}
        </p>
        <p className="text-sm text-gray-600 text-right">
          {address.address_line_1}
        </p>

        {/* Action Buttons */}
        <div className="flex self-end gap-4 mt-2">
          <button
            onClick={() => onEdit(address)}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
          >
            <Pencil size={16} />
            تعديل
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      </div>
    </Card>
  );
}
