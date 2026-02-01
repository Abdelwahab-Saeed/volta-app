import { useTranslation } from 'react-i18next';
import React from 'react';
import SafeImage from '../common/SafeImage';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export default function OrderCard({ order }) {
  const { t, i18n } = useTranslation();
  const firstItem = order.items?.[0]?.product;
  const image = firstItem ? `${import.meta.env.VITE_IMAGES_URL}/${firstItem.image}` : '';
  const name = firstItem ? firstItem.name : t('orders.order_number') + order.id;

  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const date = new Date(order.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <Card className="border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Right Side */}
          <div className="w-full md:w-1/3 p-8 flex items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-l">
            {image && (
              <SafeImage
                src={image}
                alt={name}
                className="object-contain max-h-56 drop-shadow-lg"
              />
            )}
          </div>

          {/* Content Section - Left Side */}
          <div className="flex-1 p-8 bg-white flex flex-col justify-between">
            {/* Product Title */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="text-start">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {name}
                  </h3>
                  {order.items?.length > 1 && (
                    <span className="text-sm text-gray-500">
                      +{order.items.length - 1} {t('orders.other_products')}
                    </span>
                  )}
                </div>

                {/* Price Section */}
                <div className="text-left whitespace-nowrap">
                  <span className="text-2xl md:text-3xl font-bold text-red-600" dir="ltr">
                    {order.total_amount} {t('common.currency')}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-2 text-gray-700">
                <p className="text-base">
                  <span className="font-medium text-gray-900">{t('orders.status')}:</span>{' '}
                  <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm font-bold">
                    {t(`orders.statuses.${order.status}`) || order.status}
                  </span>
                </p>
                <p className="text-base">
                  <span className="font-medium text-gray-900">{t('orders.date')}:</span> {date}
                </p>
                <p className="text-base">
                  <span className="font-medium text-gray-900">{t('orders.items_count')}:</span>{' '}
                  {totalItems}
                </p>
                <p className="text-base">
                  <span className="font-medium text-gray-900">{t('orders.payment_method')}:</span>{' '}
                  {order.payment_method === 'cash' ? t('orders.cash_on_delivery') : order.payment_method}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex flex-wrap items-center gap-3 mt-6 md:w-2/3">
              <Button className="flex-1 h-12 bg-secondary hover:bg-secondary/90 text-white transition-colors">
                عرض التفاصيل
              </Button>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
