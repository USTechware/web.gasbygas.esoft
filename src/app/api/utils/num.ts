import { IProduct } from "@/data/models/products";

class Num { 
    static calculateTotal(product: IProduct | undefined, qty: number): string {
        if(!product) return `Rs. ${Number(0).toFixed(2)}`
        return `Rs. ${(Number(product.price) * qty).toFixed(2)}`;
    }
}

export default Num;