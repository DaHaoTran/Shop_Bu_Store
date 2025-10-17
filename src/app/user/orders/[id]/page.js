"use client"
import React, { useEffect, useState } from 'react'
import AddressC from '../../../components/AddressC'
import ProductTableLikeC from '../../../components/ProductTableLikeC'
import { Spinner, Table } from 'reactstrap'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function OrderDetails() {
  const params = useParams();
  const [orderId, setOrderId] = useState(null);
  const [orderUsed, setOrderUsed] = useState(null);
  const { orders } = useSelector(x => x.order);

  useEffect(() => {
    if (!params) return
    setOrderId(params.id);
  }, [params])

  useEffect(() => {
    if (!orderId) return
    if (!orders) return
    setOrderUsed(orders.find(x => x.orderId === orderId));
  }, [orderId, orders])

  return (
    <>
      <title>Order details</title>
      {orderUsed ? (
      <div className='p-2' >
        <div>
          <AddressC name={orderUsed.name}
            phoneNumber={orderUsed.phoneNumber}
            shippingAddress={orderUsed.shippingAddress} />
        </div>
        <div className='m-2'>
          <ProductTableLikeC product={orderUsed} />
        </div>
        <div className='m-2'>
          <Table bordered>
            <thead>
              <tr className='text-end'>
                <td>Tổng tiền sản phẩm</td>
                <td>{orderUsed.currentPrice * orderUsed.quantityInCart} dong</td>
              </tr>

              <tr className='text-end'>
                <td>Phí vận chuyển</td>
                <td>{orderUsed.shippingPrice} dong</td>
              </tr>

              <tr className='text-end'>
                <td>Tổng thanh toán</td>
                <td><h3>{orderUsed.currentPrice * orderUsed.quantityInCart + orderUsed.shippingPrice} dong</h3></td>
              </tr>

              <tr className='text-end'>
                <td>Phương thức thanh toán</td>
                <td>{orderUsed.paymentMethod}</td>
              </tr>
            </thead>
          </Table>
        </div>
      </div>
      ) : <Spinner />}
    </>
  )
}
