'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import ProductC from '../../components/ProductC'
import ProductPHC from '../../components/ProductPHC'
import ShopC from '../../components/ShopC'
import '../../globals.css'
import { useRouter, useSearchParams } from 'next/navigation'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { setegid } from 'process'
import useFetch from '../../hooks/useFetch'
import { addProduct } from '../../../app/stores/product/productSlice'
import { addShop } from '../../../app/stores/shop/shopSlice'

export default function ProductFilter() {
  const searchParams = useSearchParams()
  const searchStr = searchParams.get('search')
  const [error, setError] = useState(null)
  const { products } = useSelector(x => x.product);
  const { shops } = useSelector(x => x.shop);
  const [productsFilter, setProductsFilter] = useState([]);
  const [shopsFilter, setShopsFilter] = useState([]);
  const [hasMore, setHasMore] = useState(true)
  const [words, setWords] = useState(null)
  const { data: productData } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products?productName=${searchStr}`)
  const { data: shopData } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/shops?shopName=${searchStr}`)
  const dispatch = useDispatch();
  const router = useRouter();

  const refresh = () => {
    setProductsFilter([])
  }

  const fetchData = () => {
    return
  }

  const onProductClick = (productId) => {
    router.push(`/product/${productId}`)
  }

  //Get products from local with each string in words array
  useEffect(() => {
    try {
      if (!words) return

      let allProductFiltered = [];

      for (let i = 0; i < words.length; i++) {
        //Filter product
        var productsF = products.filter(x => x.productName.toLowerCase() == words[i].toLowerCase()
          || x.productName.includes(words[i]) || x.productName.includes(words[i].toLowerCase())
          || x.productName.includes(words[i].toUpperCase()))
        if (!productsF) return

        allProductFiltered = [...allProductFiltered, ...productsF];

      }
      // Remove duplicates by `id`
      const uniqueFiltered = allProductFiltered.filter((item, index, self) =>
        index === self.findIndex(t => t.productId === item.productId)
      );
      setProductsFilter(uniqueFiltered);
      
      setHasMore(false)
    } catch (ex) {
      console.log(ex)
    }
  }, [words])

  //Get shops from local with each string in words array
  useEffect(() => {
    try {
      if (!words) return

      let allShopFiltered = [];

      for (let i = 0; i < words.length; i++) {
        //Filter product
        var shopsF = shops.filter(x => x.shopName.toLowerCase() == words[i].toLowerCase()
          || x.shopName.includes(words[i]) || x.shopName.includes(words[i].toLowerCase())
          || x.shopName.includes(words[i].toUpperCase()))
        if (!shopsF) return

        allShopFiltered = [...allShopFiltered, ...shopsF];

      }
      // Remove duplicates by `id`
      const uniqueFiltered = allShopFiltered.filter((item, index, self) =>
        index === self.findIndex(t => t.shopId === item.shopId)
      );
      setShopsFilter(uniqueFiltered.length > 3 ? uniqueFiltered.slice(0, 3) : uniqueFiltered);
      console.log(shopsFilter)
    } catch (ex) {
      console.log(ex)
    }
  }, [words])

  useEffect(() => {
    if (!productData) return
    productData.map((x) => {
      dispatch(addProduct(x))
    })
  }, [productData]);

  useEffect(() => {
    if(!shopData) return
    shopData.map((x) => {
      dispatch(addShop(x));
    })
  }, [shopData])

  //First load
  useEffect(() => {
    setProductsFilter([])
    setShopsFilter([])
    setWords(null)

    if (!searchStr) {
      setError('Không tìm thấy sản phẩm !')
      setHasMore(false)
      return
    }

    setWords([searchStr, ...searchStr.split(' ')])

    if (!products) {
      setError('Xảy ra lỗi !')
      setHasMore(false)
      return
    }
  }, [searchStr, products])

  if (error) return (<h5 className='m-2'>{error}</h5>)
  return (
    products && (
      <>
        <title>Products for search result: {searchStr}</title>
        <div className='m-2'>
          <div className='row'>
            {shopsFilter && shopsFilter.map((x) => (
              <div className='col-lg-3 col-md-6' key={x.shopId}>
                <ShopC sourceImg={'../../sample2.png'} shopName={x.shopName} />
              </div>
            ))}
          </div>
        </div>

        <InfiniteScroll
          dataLength={productsFilter.length}
          next={fetchData}
          scrollThreshold={0.8}
          hasMore={hasMore}
          loader={(
            <div className="m-2">
              <div className="row">
                {Array(6).fill(0).map((_, index) => (
                  <div className="col-lg-2 col-md-4" key={index}>
                    <ProductPHC />
                  </div>
                ))}
              </div>
            </div>
          )}

          refreshFunction={refresh}
        >
          <div className="m-2">
            <div className="row">
              {productsFilter.map((x) => (
                <div className="col-lg-2 col-md-4 my-2" key={x.productId}>
                  <div onClick={() => onProductClick(x.productId)}>
                    <ProductC
                      sourceImg={'/sample.jpg'}
                      productName={x.productName}
                      currentPrice={`${x.currentPrice} dong`}
                      previousPrice={`${x.previousPrice} dong`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  )
}
