import React from 'react'
import './AddressC.css'

export default function AddressC({ name, phoneNumber, shippingAddress }) {
  return (
    <div className='address-container p-1'>
      <p className='fs-4'>Địa chỉ nhận hàng</p>
      <div className='d-flex justify-content-start'>
        <p>{name}</p>
        <p className='mx-2'>{phoneNumber}</p>
        <p className='mx-2'>{shippingAddress}</p>
      </div>
    </div>
  )
}
