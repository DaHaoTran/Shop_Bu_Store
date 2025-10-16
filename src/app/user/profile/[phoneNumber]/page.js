"use client"
import React, { useEffect, useState } from 'react'
import { Card } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from '../../../hooks/useFetch'
import { useRouter } from 'next/navigation'
import { addAddress } from '../../../stores/user/userSlice'

export default function ProfileDetail() {
  const { data } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/user`)
  const [address, setAddress] = useState(null);
  const { user, addresses } = useSelector(x => x.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const onEditAddressClick = () => {
    router.push('/user/shipping-address')
  }

  useEffect(() => {
    if (!data) return
    if (!data.address) return
    data.address.map((x) => {
      dispatch(addAddress(x));
    });
  }, [data])

  useEffect(() => {
    if (!addresses) return
    if (Object.keys(addresses).length <= 0) return
    const getAddress = addresses.find(x => x.isChoose == true);
    if (!getAddress) return
    setAddress(getAddress);
  }, [addresses])

  return (
    <>
      <title>Profile details</title>
      <div className='m-5'>
        <h1 className='mt-5 text-center'>Thông tin tài khoản</h1>
        <h5 className='m-2'>{user.email}</h5>
        <h5 className='mx-2 mt-2'>Địa chỉ giao hàng mặc định:</h5>
        {address ? (
          <Card className='m-2 p-2'>
            <div className='row'>
              <h4 className='text-start col-6'>{address.name}</h4>
              <a className='text-end col-6' onClick={() => onEditAddressClick()}>{'Đổi địa chỉ >>>'}</a>
            </div>
            <p>{address.phoneNumber}</p>
            <p>{address.shippingAddress}</p>
          </Card>
        ) : <h2>Loading...</h2>}
      </div>
    </>
  )
}
