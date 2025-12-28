import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import stabilizer from '../assets/home/stabilizer.png';
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@base-ui/react";

export default function Comparison() {

    const products = [
        {
          name: 'منتج 1',
          image: stabilizer,
          price: 1000,
          discount: 10,
        },
        {
          name: 'منتج 2',
          image: stabilizer,
          price: 1000,
          discount: 15,
        },
      ];

    const borderStyle = `border border-secondary`;

    return <>
        <div className="flex justify-center items-center m-20">
            <Table className="border-collapse border border-secondary">
                <TableBody>
                    <TableRow className={`h-60 text-center text-xl`}>
                    <TableCell className={`${borderStyle} w-20`}>المنتج</TableCell>
                    <TableCell className={`${borderStyle} w-40`}>
                        <div className="w-80 m-auto">
                            <img src={products[0].image} alt="Product Image"  />
                        </div> 
                    </TableCell>
                    <TableCell className={`${borderStyle} w-40`}>
                        <div className="w-80 m-auto">
                            <img src={products[1].image} alt="Product Image"  />
                        </div> 
                    </TableCell>
                    </TableRow>

                    <TableRow className={`h-15 text-center text-xl`}>
                    <TableCell className={`${borderStyle} w-20`}>وصف المنتج</TableCell>
                    <TableCell className={`${borderStyle} w-40`}> {products[0].description ?? ''} </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> {products[1].description ?? ''} </TableCell>
                    </TableRow>

                    <TableRow className={`h-15 text-center text-xl`}>
                    <TableCell className={`${borderStyle} w-20`}>سعر</TableCell>
                    <TableCell className={`${borderStyle} w-40`}> {products[0].price ?? ''} </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> {products[1].price ?? ''} </TableCell>
                    </TableRow>

                    <TableRow className={`h-15 text-center text-xl`}>
                    <TableCell className={`${borderStyle} w-20`}>كود المنتج</TableCell>
                    <TableCell className={`${borderStyle} w-40`}> {products[0].code ?? ''} </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> {products[1].code ?? ''} </TableCell>
                    </TableRow>

                    <TableRow className={`h-15 text-center text-xl`}>
                    <TableCell className={`${borderStyle} w-20`}>أضف إلى العربة </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> 
                        <Button className="w-60 h-11 bg-secondary hover:bg-[#0058AB] text-white">
                            <div className="flex gap-2 justify-center items-center">
                            <ShoppingCart />
                            <span className="text-lg">أضف إلى العربة</span>
                            </div>
                        </Button> 
                    </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> 
                        <Button className="w-60 h-11 bg-secondary hover:bg-[#0058AB] text-white">
                            <div className="flex gap-2 justify-center items-center">
                            <ShoppingCart />
                            <span className="text-lg">أضف إلى العربة</span>
                            </div>
                        </Button> 
                    </TableCell>
                    </TableRow>

                    <TableRow className={`h-15 text-center text-xl`}>
                    <TableCell className={`${borderStyle} w-20`}>حذف </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> 
                        <Button className="">
                            <Trash2 className="text-secondary" size={34} />
                        </Button>
                    </TableCell>
                    <TableCell className={`${borderStyle} w-40`}> 
                        <Button className="">
                            <Trash2 className="text-secondary" size={34} />
                        </Button>
                    </TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </div>
    </>
}