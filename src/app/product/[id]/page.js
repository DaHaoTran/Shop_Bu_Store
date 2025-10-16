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
  const { products } = useSelector(x => x.product)
  const { data } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/productDetails?productId=${params.id}`)
  const { productsInCart } = useSelector(x => x.cart)
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
    if (data) setProductDetail(data[0])
  }, [data])

  return (
    <div className='p-3'>
      {!product && <Spinner />}
      {error && <h3>{error}</h3>}
      {product && (
        <>
          <title>{product.productName}</title>
          <div className='row'>
            <div className='col-lg-3 col-md-12 d-flex justify-content-center align-items-center'>
              <Image src={'/sample.jpg'}
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
                <h5 className='mb-2'>{productDetail.content}: Duis irure deserunt labore sint reprehenderit dolore. Ullamco eu non reprehenderit voluptate magna veniam aliquip cillum do. Reprehenderit anim est elit dolor. Cupidatat esse ex ea dolor esse labore quis ad adipisicing irure in nisi. Dolore voluptate proident reprehenderit esse eu nostrud veniam sint culpa sit enim anim.

                  Commodo incididunt fugiat occaecat deserunt commodo mollit ut minim consectetur laborum magna. Sit minim Lorem adipisicing velit tempor in minim deserunt tempor sint cillum culpa culpa occaecat. Incididunt occaecat enim irure cillum reprehenderit nostrud laboris proident ipsum consequat sit cupidatat consequat magna. Duis irure est duis esse incididunt non aliquip veniam do nostrud anim sunt consectetur enim.

                  Fugiat officia ea nostrud consectetur consectetur in quis mollit laboris mollit occaecat ad. Enim anim consectetur nulla esse reprehenderit adipisicing voluptate consequat enim labore. Non velit Lorem duis do fugiat elit laboris adipisicing magna esse. Esse id ea pariatur nulla eiusmod minim magna minim deserunt qui voluptate dolor tempor amet. Ipsum quis deserunt anim eu incididunt reprehenderit nostrud deserunt.

                  Enim consequat adipisicing sunt dolore officia fugiat enim esse. Laborum magna ut laborum laboris elit sit et id duis dolor nisi. Ad sit commodo culpa elit esse aute tempor laboris reprehenderit officia ea. Enim anim consectetur mollit ut culpa deserunt. Laborum non sunt sunt et pariatur consequat nulla amet aliquip. Aute elit tempor officia laboris laborum et officia officia.

                  Nisi magna officia officia anim nostrud officia nisi elit non culpa. Sit nostrud elit id sint ex sint sunt quis irure ut eiusmod velit Lorem. Laboris dolore laboris excepteur ex.

                  Voluptate eiusmod voluptate dolore ipsum dolore exercitation excepteur elit. Cillum ex fugiat anim sunt laboris aute aliquip consectetur eu. Cupidatat officia nostrud do voluptate voluptate labore proident. Irure Lorem elit aute pariatur cupidatat commodo. Tempor cillum proident ad do eiusmod.

                  Veniam sint pariatur magna sit sit ipsum fugiat deserunt. Ea aute ullamco eiusmod proident occaecat sit ea. Commodo dolore velit incididunt officia minim. Pariatur duis et est sunt commodo adipisicing non mollit reprehenderit qui veniam id. Proident dolor tempor pariatur dolore. Ipsum in anim laboris occaecat incididunt esse magna duis ullamco exercitation. Est ipsum incididunt aliqua deserunt esse labore esse exercitation esse tempor pariatur et irure.

                  Sunt excepteur velit aliquip ullamco aliquip minim. Velit sit anim incididunt esse mollit dolor exercitation proident et laboris. Ex ea nisi nostrud et laboris dolor Lorem id consequat esse commodo sunt do. Qui veniam mollit officia incididunt. Duis ullamco laboris magna Lorem cupidatat magna eiusmod consequat irure commodo tempor duis. Excepteur reprehenderit cupidatat in excepteur dolore ullamco eiusmod amet.

                  Irure pariatur laboris labore excepteur Lorem in. Excepteur in id veniam amet dolore eu cillum nisi deserunt nulla enim aute. Sunt cupidatat excepteur duis aute sunt sint adipisicing culpa nulla occaecat. Irure mollit aliqua irure eiusmod anim sit ullamco minim quis eu aute aute culpa non.

                  Duis nulla laborum fugiat mollit mollit dolor. Sit eiusmod nisi magna proident qui deserunt elit id duis irure. Ex aute fugiat laborum eu excepteur mollit aute excepteur consectetur. Sunt laboris deserunt laborum enim. Quis ea duis officia excepteur occaecat reprehenderit. Cupidatat irure exercitation irure pariatur est amet culpa occaecat. Laboris et duis magna deserunt irure dolor ut enim do et ad.</h5>
              </>
            ) : <Spinner />}
          </div>
        </>
      )}

    </div>
  )
}

