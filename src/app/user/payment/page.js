"use client"
import React, { useCallback, useEffect, useState } from 'react'
import AddressC from '../../components/AddressC'
import ProductWithSU_C from '../../components/ProductWithSU_C'
import { Spinner, Table, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap'
import styles from './page.module.css'
import { useSelector, useDispatch } from 'react-redux'
import useFetch from '../../hooks/useFetch'
import { useRouter, useSearchParams } from 'next/navigation'
import { addOrder } from '../../stores/order/orderSlice'
import Swal from 'sweetalert2'
import { addProduct, clearProduct, removeProduct } from '../../stores/cart/cartSlice'
import { addAddress } from '../../stores/user/userSlice'

export default function Payment() {
  const { productsInCart } = useSelector(x => x.cart);
  const { user, addresses } = useSelector(x => x.user);
  const { orders } = useSelector(x => x.order);
  const { data: shippingData } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/shippingUnit`);
  const [addressUsed, setAddressUsed] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingUnitArr, setShippingUnitArr] = useState(null);
  const [isAllowPayment, setIsAllowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productsToPay, setProductsToPay] = useState(null);
  const [productId, setProductId] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const onPaymentMethodClick = useCallback((paymentStr) => {
    setPaymentMethod(paymentStr);
  }, [paymentMethod]);

  const addnewOrder = (order) => {
    dispatch(addOrder(order))
  }

  const createNewOrderId = () => {
    const date = new Date();
    return `ORD${String(date.getUTCDate())}${String(date.getUTCMonth())}${(String(date.getUTCFullYear())).substring(2, 4)}${String(date.getUTCHours())}${String(date.getUTCMinutes())}${String(date.getMilliseconds())}`;
  }

  const onPaymentConfirmClick = async () => {
    if (!paymentMethod) return
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      for (let i = 0; i < productsToPay.length; i++) {
        if (!productsToPay[i].shippingUnitId) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Please choose shipping unit !",
            showConfirmButton: false,
            timer: 1500
          });
          return;
        }

        addnewOrder({
          orderId: createNewOrderId(),
          paymentMethod: paymentMethod,
          status: 'confirmed',
          ...addressUsed,
          ...productsToPay[i]
        })

        dispatch(removeProduct(productsToPay[i].productId));

        //Call API to update product quantity
        var productContent = {
          "productId": productsToPay[i].productId,
          "userEmail": productsToPay[i].userEmail,
          "productName": productsToPay[i].productName,
          "image": productsToPay[i].image,
          "quantity": productsToPay[i].quantity - productsToPay[i].quantityInCart,
          "currentPrice": productsToPay[i].currentPrice,
          "previousPrice": productsToPay[i].previousPrice,
          "comments": productsToPay[i].comments
        }
        await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/products/${productsToPay[i].productId}`, {
            headers: {
              "Content-Type": "application/json",
              "authorization": "Bearer " + user.token
            },
            method: 'PUT',
            body: JSON.stringify(productContent)
        })
      }

      Swal.fire({
        title: "Thông báo",
        text: "Đặt hàng thành công !",
        icon: "success"
      });
    } catch (ex) {

    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (!addresses) return
    if (addresses.length <= 0) {
      router.push('/user/shipping-address/edit');
      return;
    }
    setAddressUsed(addresses.find(x => x.isChoose == true))
  }, [addresses])

  useEffect(() => {
    if (!shippingData) return
    setShippingUnitArr(shippingData);
  }, [shippingData])

  useEffect(() => {
    if (!paymentMethod) return
    setIsAllowPayment(true);
  }, [paymentMethod]);

  useEffect(() => {
    if (!productsInCart) return
    //Get only product if has id
    if (productId) {
      setProductsToPay(productsInCart.filter(x => x.productId == productId))
      return
    }
    setProductsToPay(productsInCart.filter(x => x.willPayment == true))
  }, [productsInCart])

  //Redirect to home page if the cart is empty
  useEffect(() => {
    if (!productsToPay) return
    if (Object.keys(productsToPay).length <= 0) router.push('/#')
  }, [productsToPay])

  useEffect(() => {
    if (!searchParams) return
    setProductId(searchParams.get('productId'));
  }, [searchParams])

  useEffect(() => {
    if (!productId) return
    const product = productsInCart.find(x => x.productId === productId);
    if (!product) return
    setProductsToPay([product]);
  }, [productId])

  return (
    <div className='p-2'>
      <title>Payment</title>
      <div>
        {addressUsed ? (
          <AddressC name={addressUsed.name}
            phoneNumber={addressUsed.phoneNumber}
            shippingAddress={addressUsed.shippingAddress} />
        ) : <Spinner color='primary' />}
      </div>
      <div className='m-2'>
        {productsToPay && productsToPay.map((x) => (
          <div key={x.productId}>
            <ProductWithSU_C product={x} shippingUnitArr={shippingUnitArr} />
          </div>
        ))}
      </div>
      <div className='m-2'>
        <p className='fs-5'>Phương thức thanh toán</p>
        <div>
          <button className='p-1 me-2 bg-dark text-white' onClick={async () => await onPaymentMethodClick('in cash')}>Thanh toán khi nhận hàng</button>
          <button className='p-1 bg-dark text-white' onClick={async () => await onPaymentMethodClick('debit card')}>Thẻ ghi nợ</button>
        </div>
      </div>
      {productsToPay && addressUsed && shippingUnitArr && (
        <>
          <div className='m-2 row'>
            <div className='col-6'></div>
            <div className='col-6'>
              <Table borderless>
                <thead>
                  <tr className='text-end'>
                    <td>Phương thức thanh toán</td>
                    <td>{paymentMethod ? paymentMethod : 'chưa có'}</td>
                  </tr>
                </thead>
              </Table>
            </div>
          </div>
          <div className='m-2 mb-5 d-flex justify-content-end'>
            <button className={styles.paymentBtn} disabled={!isAllowPayment} onClick={() => onPaymentConfirmClick()}>
              {!isProcessing ? <h5>Đặt hàng</h5> : (<div className='d-flex justify-content-center'>
                <Spinner
                  color="white"
                  type="grow"
                ></Spinner>
                <Spinner
                  color="white"
                  type="grow"
                ></Spinner>
                <Spinner
                  color="white"
                  type="grow"
                ></Spinner>
              </div>)}</button>
          </div>
        </>
      )}
    </div>
  )
}
