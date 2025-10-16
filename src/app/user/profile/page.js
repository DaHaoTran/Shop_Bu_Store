"use client"
import React, { useEffect } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Button, Card, CardBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import useFetch from '../../hooks/useFetch';
import { addOrder } from '../../stores/order/orderSlice';

export default function Profile() {
  const shippingStatusBtnList = [
    {
      name: 'Đã xác nhận',
      queryParam: 'confirmed'
    },
    {
      name: 'Đang giao',
      queryParam: 'shipping'
    },
    {
      name: 'Lịch sử',
      queryParam: 'completed'
    }
  ]
  const { user } = useSelector(x => x.user);
  const { data: orderData } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/orders`)
  const router = useRouter();
  const dispatch = useDispatch();

  const getUsername = (email) => {
    if(!email) return null
    return email.slice(0, email.indexOf('@'));
  }

  const onDetailsClick = () => {
    router.push(`/user/profile/${user.phoneNumber}`)
  }

  const onOrderFillteringClick = (statusStr) => {
    router.push(`/user/orders?status=${statusStr}`)
  } 

  useEffect(() => {
    if(!orderData) return
    orderData.map((x) => {
      dispatch(addOrder(x));
    })
  }, [orderData])

  if(!user) return <h2>There are unexpected error !</h2>
  return (
    <>
      <title>Profile</title>
      <div className='m-3 d-flex justify-content-between align-items-center'>
        <div className='d-flex justify-content-start align-items-center'>
          <FaUserCircle size={80} />
          <h3 className='ms-2'>{getUsername(user.email)}</h3>
        </div>
        <Button color='info' onClick={() => onDetailsClick()}>Chi tiết</Button>
      </div>
      <hr />
      <h3 className='m-2'>{'Đơn hàng >>>'}</h3>
      <div className='m-3 d-flex justify-content-around'>
        {shippingStatusBtnList.map((x, index) => (
          <Button className='w-25 p-5 text-center d-flex justify-content-center' color='primary' key={index} onClick={() => onOrderFillteringClick(x.queryParam)}>
            <h1>{x.name}</h1>
          </Button>
        ))}
      </div>
    </>
  )
}

