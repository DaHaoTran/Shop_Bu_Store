"use client"
import React, { useCallback } from 'react'
import CartC from '../../components/CartC'
import { Button } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function page() {
  const { productsInCart } = useSelector(x => x.cart)
  const router = useRouter();

  const onPaymentBtnClick = () => {
    //Check if selected product length are zero
    if(productsInCart.filter(x => x.willPayment == true).length <= 0) {
      Swal.fire({
        title: 'Thông báo!',
        text: 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán',
        icon: 'info'
      })
      return
    }

    router.push('/user/payment')
  }

  return (
    <div className='p-2'>
      <title>Cart</title>
      <h1 className='text-center m-3'>Giỏ hàng</h1>
      {productsInCart && Object.keys(productsInCart).length > 0 ? (
        productsInCart.map((x) => (
          <CartC key={x.productId} 
            product={x}
            shopName={'Shop A'}
            shopLink={'#'}
          />
        ))
      ) : <h3>Bạn chưa lựa được cho mình món nào nhỉ !</h3>}
      {productsInCart && Object.keys(productsInCart).length > 0 && (
        <div className='m-3 d-flex justify-content-center'>
          <Button color='dark' onClick={() => onPaymentBtnClick()}>Thanh toán</Button>
        </div>
      )}
    </div>
  )
}
