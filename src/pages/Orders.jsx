import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import OrderCard from '../components/orders/OrderCard';
import { useOrderStore } from '@/stores/useOrderStore';
import { Loader2 } from 'lucide-react';

export default function Orders() {
  const { t } = useTranslation();
  const { orders, fetchOrders, isLoading } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        {t('orders.no_orders')}
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      {orders.map((order) => <OrderCard key={order.id} order={order} />)}
    </div>
  );
}
