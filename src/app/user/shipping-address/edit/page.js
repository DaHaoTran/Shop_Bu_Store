"use client"
import React, { useCallback, useEffect, useState } from 'react'
import FormBasicC from '../../../components/FormBasicC'
import './page.module.css'
import Swal from 'sweetalert2'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, editAddress } from '../../../stores/user/userSlice'
import secureLocalStorage from 'react-secure-storage'

export default function EditShippingAddress() {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [addressToE, setAddressToE] = useState(null)
  const [id, setId] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { addresses } = useSelector(x => x.user);
  const searchParams = useSearchParams();

  const _inputArr = useCallback([
    {
      label: 'Tên nhận hàng',
      type: 'text',
      defaultValue: addressToE ? addressToE.name : undefined,
      setValue: setName,
      isRequired: true
    },
    {
      label: 'Số điện thoại',
      type: 'text',
      defaultValue: addressToE ? addressToE.phoneNumber : undefined,
      setValue: setPhoneNumber,
      isRequired: true
    },
    {
      label: 'Địa chỉ giao hàng',
      type: 'text',
      defaultValue: addressToE ? addressToE.shippingAddress : undefined,
      setValue: setShippingAddress,
      isRequired: true
    }
  ], [addressToE])

  const onFormSubmit = useCallback((e) => {
    e.preventDefault();
    Swal.fire({
      title: "Xác nhận !",
      text: "Bạn đã kiểm tra kĩ thông tin chưa ? Điền sai thì không có nhận hàng được nhé ! 😊",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3227ffff",
      cancelButtonColor: "rgba(0, 0, 0, 1)",
      confirmButtonText: "Vâng"
    }).then((result) => {
      if(!result.isConfirmed) return
      
      if (id) {
        dispatch(editAddress({ ...addressToE, name: name, phoneNumber: phoneNumber, shippingAddress: shippingAddress }))
      } else {
        //Create new id
        let id = addresses.length + 1;
        setTimeout(() => {
          while (true) {
            const address = addresses.find(x => x.id === id);
            if (!address) break;
            id++;
          }
        }, 500);

        dispatch(addAddress({ id: id, name: name, phoneNumber: phoneNumber, shippingAddress: shippingAddress, isChosse: false }))
      }

      Swal.fire({
        title: "Thông báo",
        text: `${id ? 'Chỉnh sửa' : 'Thêm mới'} địa chỉ thành công`,
        icon: "success"
      });
      
      router.push('/user/shipping-address')
    });
  }, [name, phoneNumber, shippingAddress])

  useEffect(() => {
    if(!searchParams) return
    setId(searchParams.get('id'))
  }, [searchParams])

  useEffect(() => {
    if(!id) return
    setAddressToE(JSON.parse(secureLocalStorage.getItem('address')))
    secureLocalStorage.removeItem('address')
  }, [id])

  useEffect(() => {
    if(!addressToE) return
    setName(addressToE.name)
    setPhoneNumber(addressToE.phoneNumber)
    setShippingAddress(addressToE.shippingAddress)
  }, [addressToE])

  return (
    <>
      <title>New shipping addressToE form</title>
      <div className='d-flex justify-content-center mt-5'>
        <FormBasicC inputArr={_inputArr} onSubmitMethod={onFormSubmit} title={'Địa chỉ mới'}/>
      </div>
    </>
  )
}
