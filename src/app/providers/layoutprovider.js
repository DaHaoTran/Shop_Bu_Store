"use client"
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Input,
    Form,
} from 'reactstrap';
import { TiShoppingCart } from "react-icons/ti";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";
import { addProduct, createProduct } from "../stores/cart/cartSlice";
import { addOrder, createOrder } from "../stores/order/orderSlice";
import useFetch from "../hooks/useFetch";
import { createUser, deleteUser, createAddress, addAddress, getShippingId } from "../stores/user/userSlice";
import secureLocalStorage from "react-secure-storage";

export default function LayoutProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(null);
    const { productsInCart } = useSelector(x => x.cart);
    const { user, addresses } = useSelector(x => x.user);
    const { orders } = useSelector(x => x.order);
    const dispatch = useDispatch();
    const [isClient, setIsClient] = useState(false);
    const cartLocalStorageData = useLocalStorage('cart', productsInCart && Object.keys(productsInCart).length > 0 ? productsInCart : null);
    const userLocalStorageData = useLocalStorage('user', user && Object.keys(user).length > 0 ? user : null);
    const { data: userData } = useFetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/${user.email}`, "application/json", "Bearer " + user.token);

    const toggle = () => setIsOpen(!isOpen);
    const router = useRouter();

    const onSearchInputChange = useCallback((e) => {
        setSearchInput(e.target.value)
    }, [searchInput])

    const onSearchSubmit = useCallback((e) => {
        e.preventDefault()
        router.push(`/product/filter?search=${searchInput}`)
    }, [searchInput])

    const onCartClick = () => {
        router.push(`/user/cart`)
    }

    const onLogoutClick = () => {
        secureLocalStorage.clear();
        dispatch(deleteUser());
        setTimeout(() => {
            window.location.href = '/'
        }, 200);
    }

    const onProfileClick = () => {
        router.push('/user/profile')
    }

    const onShopClick = () => {
        router.push('/shop/regis')
    } 

    useEffect(() => {
        if(!user) return
        if(Object.keys(user).length > 0) return
        window.location.href = '/identify/login'
    }, [user])

    useEffect(() => {
        if(!userData) return
        if(Object.keys(addresses).length > 0) return
        dispatch(createAddress(JSON.parse(userData.shippingList || "[]")));
        dispatch(createOrder(JSON.parse(userData.orderList || "[]")));
        dispatch(createProduct(JSON.parse(userData.cartList || "[]")));
    }, [userData])

    useEffect(() => {
        if (!user) return
        if (!orders) return
        if (!addresses) return
        if (!productsInCart) return
        //Call API update user data
        function PutUserAPICalling(params) {
            var content = {
                "email": user.email,
                "phoneNumber": user.phoneNumber,
                "password": "string",
                "shippingList": JSON.stringify(addresses),
                "cartList": JSON.stringify(productsInCart),
                "orderList": JSON.stringify(orders),
                "secretKey": "string"
            }
            fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/${user.email}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + user.token
                },
                method: "PUT",
                body: JSON.stringify(content)
            })
        }
        PutUserAPICalling();
    }, [user, addresses, orders, productsInCart])

    useEffect(() => {
        setIsClient(true)
    }, [])

    if(!isClient) return <h2>Loading...</h2>
    return (
        <div>
            <div className="header-container bg-black text-white">
                <Navbar expand="lg">
                    <NavbarBrand>
                        <div onClick={() => router.push('/')}>
                            <Image src="/logo.png"
                                width={150}
                                height={50}
                                priority
                                alt="logo" />
                        </div>
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="me-auto w-100 d-flex justify-content-evenly" navbar>
                            <NavItem>
                                <Form onSubmit={(e) => onSearchSubmit(e)} className="d-flex justify-content-center align-items-center">
                                    <div className="me-3">
                                        <Input type="text" size={70} onChange={(e) => onSearchInputChange(e)}/>
                                    </div>
                                    <div>
                                        <Input type="submit" value="Tìm kiếm" />
                                    </div>
                                </Form>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <NavbarText className="d-flex">
                        <NavLink className="mx-2" onClick={() => onCartClick()}>
                            <TiShoppingCart size={42} color="white" />
                            <sup className="text-white fs-5">{productsInCart ? productsInCart.length : 0}</sup>
                        </NavLink>
                        {!user || Object.keys(user).length <= 0 && (
                            <>
                                <NavLink className="text-white px-2" href="/identify/register">Register</NavLink>
                                <NavLink className="text-white" href="/identify/login">Login</NavLink>
                            </>
                        )}
                        <UncontrolledDropdown inNavbar>
                            <DropdownToggle nav caret>
                                {user && Object.keys(user).length > 0 && (<FaUserCircle size={40} color="white" />)}
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem><NavLink onClick={()=> onProfileClick()}>Thông tin cá nhân</NavLink></DropdownItem>
                                <DropdownItem><NavLink onClick={()=> onShopClick()}>Kênh người bán</NavLink></DropdownItem>
                                <DropdownItem><NavLink onClick={()=> onLogoutClick()}>Đăng xuất</NavLink></DropdownItem>
                                {/* <DropdownItem divider /> */}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </NavbarText>
                </Navbar>
            </div>
            <main className="container-fluid">
                { children }
            </main>
            <div className="text-center text-white bg-black w-100 position-fixed left-0 bottom-0">
                <p className="pt-3">Made by DaHaoTran</p>
            </div>
        </div>
    );
}

