"use client"
import Image from "next/image";
import ProductC from "./components/ProductC";
import ProductPHC from "./components/ProductPHC";
import ShopC from "./components/ShopC";
import LayoutProvider from "./providers/layoutprovider";
import useFetch from "./hooks/useFetch";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, clearProduct } from "./stores/product/productSlice";
import { useRouter } from "next/navigation";
import { addShop } from "./stores/shop/shopSlice";
import styles from './page.module.css'

export default function Home() {
  const { products } = useSelector(x => x.product);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useSelector(x => x.user);
  const { data: productData, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/products?_limit=10&_skip=${skip}`, "application/json", `Bearer ${user.token}`);
  const { data: shopData } = useFetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/shops?_limit=10`, "application/json", `Bearer ${user.token}`);
  const { data: eventData } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/events?_sort=-startDate&_limit=1`);
  const { data: notifData } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/notifications?_limit=2`);
  const dispatch = useDispatch();
  const router = useRouter();

  const refresh = () => {
    dispatch(clearProduct)
  };

  const fetchData = () => {
    if (products.length > 42) return
    setSkip((prev) => prev + 10)
  };

  const onProductClick = (productId) => {
    router.push(`/product/${productId}`)
  }

  useEffect(() => {
    if (!productData) return
    if(productData.length <= 0) {
      setHasMore(false);
    }
    productData.forEach(element => {
      dispatch(addProduct(element))
    });
  }, [productData]);

  useEffect(() => {
    if (!shopData) return
    shopData.forEach(element => {
      dispatch(addShop(element))
    });
  }, [shopData])

  useEffect(() => {
    if (!products) return
    if (products.length < 42) return
    setHasMore(false);
  }, [products])

  return (
    <LayoutProvider>
      <title>Home</title>
      {error && <h5>{error}</h5>}

      <div className="row mt-4">
        <div className="col-lg-8">
          {eventData && (
            <Image src={'/sample3.png'}
              style={{ width: '100%', borderRadius: '20px' }}
              width={500}
              height={400}
              loading="lazy"
              alt="Carousel image" />
          )}
        </div>
        <div className="col-lg-4">
          {notifData && notifData.map((x) => (
            <Image key={x.id} 
              src={'/sample4.png'} 
              className="mb-2"
              style={{ width: '100%', borderRadius: '20px' }}
              width={500}
              height={196}
              loading="lazy"
              alt="Carousel image" />
          ))}
        </div>
      </div>

      <h1 className="mx-2 mt-5">Sản phẩm</h1>

      {products && (
        <InfiniteScroll
          dataLength={products.length}
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
              {products.map((x) => (
                <div className="col-lg-2 col-md-4 my-2" key={x.productId}>
                  <div onClick={() => onProductClick(x.productId)}>
                    <ProductC
                      sourceImg={`data:image/jpeg/png/jpg;base64, ${x.image}`}
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
      )}
    </LayoutProvider>
  );
}
