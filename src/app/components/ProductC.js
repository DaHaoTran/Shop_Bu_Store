"use client"
import React from 'react'
import { Card, CardImg, CardBody } from 'reactstrap'
import './ProductC.css'

export default function ProductC({ sourceImg, productName, currentPrice, previousPrice }) {
  return (
    <Card className='p-2 product'>
      <CardImg
        src={sourceImg}
        height={150}
        alt='product' />
      <p>{productName}</p>
      <p>{currentPrice}</p>
      <p><del>{previousPrice}</del></p>
    </Card>
  )
}
