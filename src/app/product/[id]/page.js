"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { InputGroup, Input, Button, Spinner } from 'reactstrap'
import styles from './page.module.css'
import { IBM_Plex_Mono } from 'next/font/google'
import { useParams, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import useFetch from '../../hooks/useFetch'
import Swal from 'sweetalert2'
import { addProduct } from '../../stores/cart/cartSlice'

export default function page() {
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)
  const [productDetail, setProductDetail] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [disabled, setDisabled] = useState(false)
  const params = useParams()
  const { products } = useSelector(x => x.product);
  const { productsInCart } = useSelector(x => x.cart);
  const { orders } = useSelector(x => x.order);
  const { user, addresses } = useSelector(x => x.user); 
  const { data: productDetailData } = useFetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/productDetails/products/${params.id}/productDetails`, 
      "application/json", "Bearer " + user.token
  )
  const dispatch = useDispatch()
  const router = useRouter();

  const onCartClick = () => {
    setDisabled(true)

    const getProd = productsInCart.find(x => x.productId === product.productId);
    if (getProd) {
      if (quantity + getProd.quantityInCart > getProd.quantity) {
        Swal.fire({
          title: "Thông báo",
          text: `Đã đạt số lượng mua hàng tối đa. Số lượng có thể thêm vào giỏ hàng: ${getProd.quantity - getProd.quantityInCart}`,
          icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              setDisabled(false)
            }, 700);
          }
        });
        return
      }
    }

    const setProd = { willPayment: true, quantityInCart: quantity, shippingUnit: null, ...product };
    dispatch(addProduct(setProd))

    Swal.fire({
      title: "Thông báo",
      text: "Đơn hàng đã được thêm vào giỏ hàng",
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          setDisabled(false)
        }, 700);
      }
    });
  }

  const onIncQuantityButtonClick = (productQuantity, quantityProdInCart) => {
    const getQuantityInCart = quantityProdInCart ? quantityProdInCart : 0;
    if (quantity + 1 > productQuantity - getQuantityInCart) return
    setQuantity(quantity + 1)
  }

  const onDesQuantityButtonClick = () => {
    if (quantity - 1 <= 0) return
    setQuantity(quantity - 1)
  }

  const onBuyNowClick = () => {
    setDisabled(true)

    const getProd = productsInCart.find(x => x.productId === product.productId);
    if (getProd) {
      if (quantity + getProd.quantityInCart > getProd.quantity) {
        Swal.fire({
          title: "Thông báo",
          text: `Đã đạt số lượng mua hàng tối đa. Số lượng có thể thêm vào giỏ hàng: ${getProd.quantity - getProd.quantityInCart}`,
          icon: "error",
        }).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              setDisabled(false)
            }, 700);
          }
        });
        return
      }
    }
    const setProd = { willPayment: true, quantityInCart: quantity, shippingUnit: null, ...product };
    dispatch(addProduct(setProd))

    router.push(`/user/payment?productId=${product.productId}`)

    setTimeout(() => {
      setDisabled(false)
    }, 700);
  }

  useEffect(() => {
    if (!products) {
      setError('Xảy ra lỗi !')
      setHasMore(false)
      return
    }

    if (!params.id) {
      setError('Sản phẩm không tồn tại !')
      setHasMore(false)
      return
    }

    setProduct(products.find(x => x.productId === params.id))
  }, [params, products])

  useEffect(() => {
    if(!productDetailData) return
    setProductDetail(productDetailData[0]);
  }, [productDetailData])

  return (
    <div className='p-3'>
      {!product && <Spinner />}
      {error && <h3>{error}</h3>}
      {product && (
        <>
          <title>{product.productName}</title>
          <div className='row'>
            <div className='col-lg-3 col-md-12 d-flex justify-content-center align-items-center'>
              <Image src={`data:image/png/jpeg/jpg;base64, ${product.image}`}
                width={350}
                height={300}
                alt='Product image' />
            </div>
            <div className='col-lg-4 col-md-12'>
              <h1>{product.productName}</h1>
              <h2>{product.currentPrice} dong<span className='text-secondary'><del>{product.previousPrice} dong</del></span></h2>
              <InputGroup className='my-3'>
                <Button color='primary' onClick={() => onDesQuantityButtonClick()}><h5>-</h5></Button>
                <div className='w-25'>
                  <Input className='text-center h-100' type='text' readOnly value={quantity} />
                </div>
                <Button color='primary' onClick={() => onIncQuantityButtonClick(product.quantity, product.quantityInCart)}><h5>+</h5></Button>
              </InputGroup>
              <div className='d-flex justify-content-start'>
                <Button className='me-2' color='dark' onClick={() => onBuyNowClick()} disabled={disabled}>Buy now</Button>
                <Button color='dark' onClick={() => onCartClick()} disabled={disabled}>Add to cart</Button>
              </div>
            </div>
            <div className='col-lg-5 col-md-12'></div>
          </div>
          <div className='my-4'>
            {productDetail ? (
              <>
                <h1 className='mb-2'>Thông tin sản phẩm</h1>
                <h5 className='mb-2'>{productDetail.description}</h5>
              </>
            ) : <Spinner />}
          </div>
        </>
      )}

    </div>
  )
}

