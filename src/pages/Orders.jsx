import React from 'react';
import OrderCard from '../components/orders/OrderCard';
import Stabilizer from '../assets/home/stabilizer.png';

const orders = [
  {
    id: 1,
    status: 'Delivered',
    image: Stabilizer,
    name: 'SVC 5–20 kVA',
    date: '2024-06-15',
    price: 20.0,
    total: 80.0,
    totalItems: 4,
  },
  {
    id: 2,
    status: 'Getting Ready',
    image: Stabilizer,
    name: 'SVC 10 kVA Stabilizer',
    date: '2024-06-15',
    price: 30.0,
    total: 30.0,
    totalItems: 1,
  },
];
export default function Orders() {
  return orders.map((order) => <OrderCard key={order.id} order={order} />);
}
