import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export default function OrderCard({ order }) {
  return (
    <Card className="border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex" dir="rtl">
          {/* Image Section - Right Side */}
          <div className="w-1/3 p-8 flex items-center justify-center bg-gray-50">
            <img
              src={order.image}
              alt={order.name}
              className="object-contain max-h-56 drop-shadow-lg"
            />
          </div>

          {/* Content Section - Left Side */}
          <div className="flex-1 p-8 bg-white flex flex-col justify-between">
            {/* Product Title */}
            <div>
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {order.name}
                  </h3>
                </div>

                {/* Price Section */}
                <div className="text-left">
                  <span className="text-3xl font-bold text-red-600">
                    {order.price} EGP
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-2 text-gray-700">
                <p className="text-base">
                  <span className="font-medium">الحالة:</span>{' '}
                  {order.status || 'تم الاستلام'}
                </p>
                <p className="text-base">
                  <span className="font-medium">التاريخ:</span> {order.date}
                </p>
                <p className="text-base">
                  <span className="font-medium">عدد المنتجات:</span>{' '}
                  {order.totalItems}
                </p>
                <p className="text-base">
                  <span className="font-medium">الإجمالي:</span> {order.total}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 w-1/2">
              <Button className="flex-1 h-12 bg-secondary hover:bg-secondary/90 text-white transition-colors">
                إعادة شراء
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
              >
                منتجات مشابهة
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
