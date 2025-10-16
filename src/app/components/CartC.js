"use client"
import React, { useCallback } from 'react'
import { Card, CardImg, InputGroup, Label, Input, Button } from 'reactstrap'
import { RiDeleteBin6Line } from "react-icons/ri";
import './CartC.css'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { removeProduct, addProduct, editProduct } from '../stores/cart/cartSlice';

export default function CartC({ product, shopName, shopLink }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const onShopClick = () => {
        router.push(shopLink)
    }

    const onDeleteClick = useCallback(() => {
        dispatch(removeProduct(product.productId))
    }, [product.productId])


    const onIncQuantityButtonCLick = (product) => {
        if (product.quantityInCart + 1 > product.quantity) return
        dispatch(editProduct({...product, quantityInCart: product.quantityInCart + 1}))
    }

    const onDescQuantityButtonCLick = (product) => {
        if (product.quantityInCart - 1 <= 0) return
        dispatch(editProduct({...product, quantityInCart: product.quantityInCart - 1,}))
    }

    const onProductChecked = (e, product) => {
        dispatch(editProduct({...product, willPayment: e.target.checked,}))
    }

    if(product) return (
        <>
            <Card className='p-1'>
                <div className='row'>
                    <div className='col-lg-2 d-flex justify-content-center align-items-center'>
                        <Input className='me-1' type='checkbox' 
                            value={product.productName} 
                            onChange={(e) => onProductChecked(e, product)} 
                            defaultChecked={product.willPayment} />
                        <CardImg
                            className='w-50'
                            src={'/sample.jpg'}
                            alt='product'
                        />
                    </div>
                    <div className='col-lg-7 text-start py-1'>
                        <h5 className='m-0'>{product.productName}</h5>
                        <p className='m-0'>{product.currentPrice} dong</p>
                        <p className='m-0'><del>{product.previousPrice} dong</del></p>
                        <a className='nav nav-link' onClick={() => onShopClick()}>{shopName + '>>>'}</a>
                    </div>
                    <div className='col-lg-2'>
                        <div className='d-flex justify-content-center align-items-center h-100'>
                            <InputGroup className='w-75'>
                                <Button color='primary' onClick={() => onDescQuantityButtonCLick(product)}><h5>-</h5></Button>
                                <Input className='text-center' type='text' readOnly value={product.quantityInCart} />
                                <Button color='primary' onClick={() => onIncQuantityButtonCLick(product)}><h5>+</h5></Button>
                            </InputGroup>
                        </div>
                    </div>
                    <div className='col-lg-1 d-flex justify-content-end'>
                        <Button className='w-50 h-100 bg-danger delete-btn' onClick={() => onDeleteClick()}><RiDeleteBin6Line /></Button>
                    </div>
                </div>
            </Card>
        </>
    )
}
