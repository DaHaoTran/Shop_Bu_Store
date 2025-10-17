"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, Spinner, NavLink } from 'reactstrap'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import useFetch from '../../hooks/useFetch'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { deleteOrder } from '../../stores/order/orderSlice'

export default function Orders() {
  const { orders } = useSelector(x => x.order)
  const searchParams = useSearchParams();
  const [orderAfterFill, setOrderAfterFill] = useState(null);
  const { data: shippingUnit } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/shippingUnit`)
  const [shippingUnits, setShippingUnits] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const onDetailClick = (id) => {
    router.push(`/user/orders/${id}`)
  }

  const onDeleteClick = (id) => {
    if (!id) return

    Swal.fire({
      title: "Xác nhận !",
      text: "Bạn có chắc muốn xóa không ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2f00feff",
      cancelButtonColor: "rgba(0, 0, 0, 1)",
      confirmButtonText: "Có",
      cancelButtonText: "Không"
    }).then((result) => {
      if (!result.isConfirmed) return
      dispatch(deleteOrder(id))
    });
  }

  useEffect(() => {
    if (!orders) return
    if (!searchParams) return

    const status = searchParams.get('status');
    setOrderAfterFill(orders.filter(x => x.status == status));
  }, [searchParams, orders])

  useEffect(() => {
    if (!shippingUnit) return
    setShippingUnits(shippingUnit);
  }, [shippingUnit])

  return (
    <>
      <title>Orders</title>
      {orderAfterFill && Object.keys(orderAfterFill).length > 0 ? orderAfterFill.map((x) => (
        <div className='p-2' key={x.orderId}>
          <Card className='m-2'>
            <CardHeader>
              <div className='row'>
                <div className='col-6 text-start'>
                  {x.shopName}
                </div>
                <div className='col-6 text-end text-success'>
                  {x.status == 'confirmed' && 'Đã xác nhận'}
                  {x.status == 'shipping' && 'Đang giao'}
                  {x.status == 'completed' && 'Hoàn tất'}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className='row'>
                <div className='col-lg-1'>
                  <Image src={'/sample.jpg'}
                    width={100}
                    height={90}
                    alt='Product image' />
                </div>
                <div className='col-lg-11'>
                  <div className='d-flex justify-content-between'>
                    <p className='m-0 p-0 fs-5'>{x.productName}</p>
                    <div className='d-flex text-primary'>
                      <NavLink className='px-2' onClick={() => onDetailClick(x.orderId)}>Chi tiết</NavLink>
                      {x.status == 'completed' && (<>
                        <p>|</p>
                        <NavLink className='px-2' onClick={() => onDeleteClick(x.orderId)}>Xóa</NavLink>
                      </>)}
                    </div>
                  </div>
                  <p className='m-0 p-0'>{x.currentPrice} dong</p>
                  <div className='row'>
                    <p className='col-3'>x{x.quantityInCart}</p>
                    <h4 className='text-end col-9'>{(x.currentPrice * x.quantityInCart) + x.shippingPrice} dong</h4>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )) : <h2>Bạn chưa có đơn hàng nào !</h2>}
    </>
  )
}
