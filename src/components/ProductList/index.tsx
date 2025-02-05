import { Dispatch, RootState } from '@/data';
import { IProduct } from '@/data/models/products';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProductList = () => {
    const dispatch = useDispatch<Dispatch>();

    const router = useRouter();

    const products = useSelector((state: RootState) => state.products.list);

    useEffect(() => {
        dispatch.products.fetchProducts();
    }, [dispatch]);

    const onSelectProduct = (product: IProduct) => {
        router.push(`/requests?p=${product._id}`)
    }

    return (
        <div className='product-list'>
            {
                products.map((product) => (
                    <div key={product._id} className='cursor-pointer rounded-sm border mr-2 bg-white product-container' onClick={onSelectProduct.bind(null, product)}>
                        <div className='product-img' style={{ backgroundImage: `url(${product.image})`}}/>
                        <div className='product-label'>{product.name} | { `Rs. ${Number(product.price).toFixed(2)}` }</div>
                    </div>
                ))
            }
        </div>
    )
}

export default ProductList