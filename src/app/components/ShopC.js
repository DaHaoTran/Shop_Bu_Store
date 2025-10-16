"use client"
import { Card, CardImg } from 'reactstrap'
import React from 'react'
import './ShopC.css'

export default function ShopC({ sourceImg, shopName }) {
    return (
        <Card>
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
