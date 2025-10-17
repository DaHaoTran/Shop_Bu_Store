"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import ProductC from '../../components/ProductC'
import ProductPHC from '../../components/ProductPHC'
import styles from './page.module.css'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useFetch from '../../hooks/useFetch'
import { useSelector } from 'react-redux'
import secureLocalStorage from 'react-secure-storage'

export default function Shop() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector(x => x.user);
  const [shop, setShop] = useState({});
  const { data: productData } = useFetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/products/filter?str=${params.email}&_limit=${30}`,
    "application/json",
    "Bearer " + user.token
  )

  const onProductClick = (productId) => {
    router.push(`/product/${productId}`)
  }

  useEffect(() => {
    setShop(JSON.parse(secureLocalStorage.getItem('shop')))
  }, [])

  useEffect(() => {
    if (!shop) return
    if (Object.keys(shop).length <= 0) return
    secureLocalStorage.removeItem('shop')
  }, [shop])

  return (
    <>
      <title>Shop name</title>
      <div className='m-2 d-flex justify-content-center align-items-center'>
        {shop && (
          <div className={styles.shopImg}>
            <Image
              src={shop.sourceImg || '/sample2.png'}
              width={150}
              height={120}
              alt='shop logo'
            />
          </div>
        )}
        <h1 className='ms-2'>{shop ? shop.shopName : 'Loading...'}</h1>
      </div>
      <hr className='line' />

      <div className='m-2'>
        <div className='row'>
          {productData && productData.map((x) => (
            <div className='col-lg-2 col-md-4' key={x.productId} onClick={() => onProductClick(x.productId)}>
              <ProductC
                sourceImg={`data:image/jpeg/png/jpg;base64, ${x.image}`}
                productName={x.productName}
                currentPrice={x.currentPrice}
                previousPrice={x.previousPrice} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
