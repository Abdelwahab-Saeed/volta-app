import ProductCard from '@/components/ProductCard';
import stabilizer from '../assets/home/stabilizer.png';
import { LayoutGrid, StretchHorizontal } from 'lucide-react';


export default function Products() {

    const categories = [
      {
        name: 'كاميرات',
        id: 1,
      },
      {
        name: 'سماعات',
        id: 2,
      },
      {
        name: 'هواتف',
        id: 3,
      },
      {
        name: 'كاميرات المراقبة',
        id: 4,
      },
      {
        name: 'شاشات',
        id: 5,
      },
    ];

    const products = [
      {
        name: 'منتج 1',
        image: stabilizer,
        price: 1000,
      },
      {
        name: 'منتج 2',
        image: stabilizer,
        price: 1000,
        discount: 15,
      },
      {
        name: 'منتج 3',
        image: stabilizer,
        price: 1000,
      },
      {
        name: 'منتج 4',
        image: stabilizer,
        price: 1000,
      },
      {
        name: 'منتج 5',
        image: stabilizer,
        price: 1000,
      },
      {
        name: 'منتج 6',
        image: stabilizer,
        price: 1000,
      },
      {
        name: 'منتج 7',
        image: stabilizer,
        price: 1000,
      },
      {
        name: 'منتج 8',
        image: stabilizer,
        price: 1000,
        discount: 10,
      },
      {
        name: 'منتج 9',
        image: stabilizer,
        price: 1000,
      },
    ];

  return (
    <>
        <div className="flex justify-center px-14 py-12">
            <aside className="border w-3/12">

            </aside>
            <div className="w-9/12 ms-12">
                <h2 className="text-3xl mb-4"> SVC 5-20 KVA </h2>
                <hr />

                <div className="flex items-center gap-2 my-4">
                    <LayoutGrid size={30} className="border-2 text-primary" />
                    <StretchHorizontal size={30} className="border-2 text-primary" />

                </div>
            
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>
        </div>
    </>
  );
}