"use client"
import { Card, CardImg } from 'reactstrap'
import React from 'react'
import './ShopC.css'
import { useRouter } from 'next/navigation'
import secureLocalStorage from 'react-secure-storage'

export default function ShopC({ sourceImg, email, shopName }) {
    const router = useRouter();
    const onCardClick = () => {
        secureLocalStorage.setItem('shop', JSON.stringify({shopName, sourceImg}));
        router.push(`/shop/${encodeURIComponent(email)}`);
    }

    return (
        <Card onClick={() => onCardClick()}>
            <div className='row p-2'>
                <div className='shop-img col-2'>
                    <CardImg className='w-100' src={sourceImg} />
                </div>
                <div className='col-10 w-50 d-flex justify-content-start align-items-center'>
                    <h4>{shopName}</h4>
                </div>
            </div>
        </Card>
    )
}
