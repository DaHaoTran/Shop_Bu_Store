"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Spinner, Table, Card, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from 'reactstrap'
import './ProductWithSU_C.css'

export default function ProductWitSU_C({ product }) {
    if (product) return (
        <div key={product.productId}>
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
        </div>
    )
}
