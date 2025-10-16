import React from 'react'
import Image from 'next/image'
import ProductC from '../../components/ProductC'
import ProductPHC from '../../components/ProductPHC'
import styles from './page.module.css'

export default function Shop() {
  return (
    <>
      <title>Shop name</title>
      <div className='m-2 d-flex justify-content-center align-items-center'>
        <div className={styles.shopImg}>
          <Image
            src='/sample2.png'
            width={150}
            height={120}
            alt='shop logo'
          />
        </div>
        <h1 className='ms-2'>Shop name</h1>
      </div>
      <hr className='line' />
      
      <div className='m-2'>
        <div className='row'>
          <div className='col-lg-2 col-md-4'>
            <ProductC
              sourceImg={'/sample.jpg'}
              productName={'Product A'}
              currentPrice={'12,000 dong'}
              previousPrice={'15,000 dong'} />
          </div>
        </div>
      </div>
      <div className="m-2">
        <div className="row">
          {Array(6).fill(0).map((_, index) => (
            <div className="col-lg-2 col-md-4" key={index}>
              <ProductPHC />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
