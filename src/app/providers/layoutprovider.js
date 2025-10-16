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
import { addProduct } from "../stores/cart/cartSlice";
import useFetch from "../hooks/useFetch";
import { createUser, deleteUser } from "../stores/user/userSlice";

export default function LayoutProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(null);
    const { productsInCart } = useSelector(x => x.cart);
    const sessionData = useLocalStorage('cart', productsInCart ? productsInCart : null);
    const dispatch = useDispatch();
    const { data } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/user`);
    const { user } = useSelector(x => x.user);
    const [isClient, setIsClient] = useState(false);

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
        dispatch(deleteUser());
        //Redirect to main screen
        window.location.href = '/#'
    }

    const onProfileClick = () => {
        router.push('/user/profile')
    }

    useEffect(() => {
        if(productsInCart) return
        if(!sessionData) return
        sessionData.forEach(element => {
            dispatch(addProduct(element));
        });
    }, [])

    useEffect(() => {
        if(!data) return

        var userInfor = data.information
        if(!userInfor) return

        dispatch(createUser(userInfor))
    }, [data])   

    useEffect(() => {
        setIsClient(true)
    })

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
                        {!user && (
                            <>
                                <NavLink className="text-white px-2" href="/identify/register">Register</NavLink>
                                <NavLink className="text-white" href="/identify/login">Login</NavLink>
                            </>
                        )}
                        <UncontrolledDropdown inNavbar>
                            <DropdownToggle nav caret>
                                {user && (<FaUserCircle size={40} color="white" />)}
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem><NavLink onClick={()=> onProfileClick()}>Thông tin cá nhân</NavLink></DropdownItem>
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

