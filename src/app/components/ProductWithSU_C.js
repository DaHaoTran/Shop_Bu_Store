"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Spinner, Table, Card, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap'
import './ProductWithSU_C.css'
import { useDispatch } from 'react-redux'
import { editProduct } from '../stores/cart/cartSlice'

export default function ProductWitSU_C({ product, shippingUnitArr }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const onShippingUnitClick = (shippingUnit, product) => {
        if (!shippingUnit) return
        dispatch(editProduct({ ...product, ...shippingUnit }));
    }

    if (product) return (
        <div key={product.productId}>
            {shippingUnitArr ? (
                <div className='shippingUnit'>
                    <p className='fs-4'>Đơn vị vận chuyển</p>
                    <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggle} direction='end'>
                        <DropdownToggle caret color='dark'>
                            {product.shippingUnit ? product.shippingUnit : 'Chọn đơn vị vận chuyển'}
                        </DropdownToggle>
                        <DropdownMenu className='mt-5'>
                            {shippingUnitArr.map((y) => (
                                <DropdownItem key={y.id} onClick={() => onShippingUnitClick({ shippingUnitId: y.id, ...y }, product)}>
                                    {y.shippingName} - {y.shippingDay}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            ) : <Spinner color='primary' />}
            <Table borderless>
                <thead>
                    <tr>
                        <th>
                            Sản phẩm
                        </th>
                        <th>
                            Đơn giá
                        </th>
                        <th>
                            Số lượng
                        </th>
                        <th>
                            Thành tiền
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            <p>{product.shopName}</p>
                            <Image src={'/sample.jpg'}
                                width={50}
                                height={40}
                                alt='product image' />
                        </th>
                        <td>
                            {product.currentPrice} dong
                        </td>
                        <td>
                            {product.quantityInCart}
                        </td>
                        <td>
                            {product.currentPrice * product.quantityInCart} dong
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div className='m-2 row'>
                <div className='col-6'></div>
                <div className='col-6'>
                    <Card className='p-2'>
                        <Table borderless>
                            <thead>
                                <tr className='text-end'>
                                    <td>Tổng tiền sản phẩm</td>
                                    <td>{product.currentPrice * product.quantityInCart} dong</td>
                                </tr>

                                <tr className='text-end'>
                                    <td>Phí vận chuyển</td>
                                    <td>{product.shippingUnitId ?
                                        (() => {
                                            if (!shippingUnitArr) return
                                            const unit = shippingUnitArr.find(z => z.id === product.shippingUnitId);
                                            return unit ? String(unit.shippingPrice) : '...';
                                        })()
                                        : '0'} dong
                                    </td>
                                </tr>

                                <tr className='text-end'>
                                    <td>Tổng thanh toán</td>
                                    <td>{product.shippingUnitId ?
                                        (() => {
                                            if (!shippingUnitArr) return
                                            const unit = shippingUnitArr.find(z => z.id === product.shippingUnitId);
                                            return unit ? String(Number(unit.shippingPrice) + (product.currentPrice * product.quantityInCart)) : '...';
                                        })()
                                        : '0'} dong
                                    </td>
                                </tr>
                            </thead>
                        </Table>
                    </Card>
                </div>
            </div>
            <hr />
        </div>
    )
}
