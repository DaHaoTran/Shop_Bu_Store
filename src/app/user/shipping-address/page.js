"use client"
import React, { useEffect, useState } from 'react'
import { Card, Input, Button, NavLink } from 'reactstrap'
import styles from './page.module.css'
import useFetch from '../../hooks/useFetch'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, editAddress, removeAddress } from '../../stores/user/userSlice'
import Swal from 'sweetalert2'
import secureLocalStorage from 'react-secure-storage'

export default function ShippingAddress() {
  const router = useRouter();
  const { user, addresses } = useSelector(x => x.user);
  const { productsInCart } = useSelector(x => x.cart);
  const { orders } = useSelector(x => x.order);
  const dispatch = useDispatch();

  const onChooseChange = (id) => {
    //Unchoose previous address
    const getPrevAddress = addresses.find(x => x.isChoose == true);
    dispatch(editAddress({ ...getPrevAddress, isChoose: false }))

    //Choose new address by id
    const getAddress = addresses.find(x => x.id === id)
    if (!getAddress) return
    dispatch(editAddress({ ...getAddress, isChoose: true }))
  }

  const onAddNewAddressClick = () => {
    router.push(`/user/shipping-address/edit`)
  }

  const onConfirmClick = () => {
    router.push(`/user/profile`)
  }

  const onDeleteClick = (id) => {
    if(!id) return

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
      dispatch(removeAddress(id))
    });
  }


  const onUpdateClick = (address) => {
    secureLocalStorage.setItem('address', JSON.stringify(address))
    router.push(`/user/shipping-address/edit?id=${address.id}`)
  }

  return (
    <>
      <title>Shipping addresses</title>
      <div className='m-5'>
        <h1 className='mt-5 mx-5 mb-4 text-center'>Địa chỉ giao hàng</h1>
        {addresses ? (
          addresses.map((x) => (
            <Card className='m-2 p-2' key={x.id}>
              <div className='d-flex justify-content-between'>
                <h4 className='text-start col-6'>{x.name}</h4>
                {!x.isChoose && (
                  <div className='d-flex justify-content-between'>
                    <NavLink className='text text-primary' onClick={() => onUpdateClick(x)}>Cập nhật</NavLink>
                    <p className='mx-2'>|</p>
                    <NavLink className='text text-primary' onClick={() => onDeleteClick(x.id)}>Xóa</NavLink>
                  </div>
                )}
              </div>
              <div className='d-flex justify-content-between'>
                <p>{x.phoneNumber}</p>
                <Input type='radio' id={x.id} value={x.id} checked={!!x.isChoose} name='user_address' onChange={() => onChooseChange(x.id)} />
              </div>
              <p>{x.shippingAddress}</p>
            </Card>
          ))
        ) : <h2>Loading</h2>}
        <Card className='m-2 p-5'>
          <Button color='transparent' onClick={() => onAddNewAddressClick()}><h1>+ Thêm địa chỉ mới</h1></Button>
        </Card>
        <div className='d-flex justify-content-center'>
          <Button className={styles.confirmBtn} onClick={() => onConfirmClick()}><h4>Xác nhận</h4></Button>
        </div>
      </div>
    </>
  )
}
