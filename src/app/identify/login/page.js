"use client"
import React, { useCallback, useEffect, useState } from 'react'
import FormWithShopLogoC from '../../components/FormWithShopLogoC'
import { Input } from 'reactstrap'
import useFetch from '../../hooks/useFetch'
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { createUser } from '../../stores/user/userSlice'
import useLocalStorage from '../../hooks/useLocalStorage'
import secureLocalStorage from 'react-secure-storage'
import { stringify } from 'querystring'

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState(null);
  const { user } = useSelector(x => x.user);
  const localStorageData = useLocalStorage('user', user && Object.keys(user).length > 0 ? user : null);
  const router = useRouter();
  const dispatch = useDispatch();

  const _inputArr = [
    {
      label: "Email hoặc số điện thoại",
      type: "text",
      setValue: setEmailOrPhone,
      isRequired: true
    },
    {
      label: "Mật khẩu",
      type: "password",
      setValue: setPassword,
      isRequired: true
    }
  ]

  const comparePasswordHash = async (plainTextPassword, paswordHash) => {
    return await bcrypt.compareSync(plainTextPassword, paswordHash);
  }

  const onInputSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      var content = {
        "email": emailOrPhone.trim(),
        "phoneNumber": emailOrPhone.trim(),
        "password": password.trim(),
        "secretKey": "string"
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/tokens/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content)
      }).then(async (response) => {
        if (!response.ok) {
          Swal.fire({
            title: 'Thông báo',
            text: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin !',
            icon: 'info'
          })
          return
        } 

        Swal.fire({
          title: 'Thông báo',
          text: 'Đăng nhập thành công !',
          icon: 'success'
        })

        dispatch(createUser({ "email": emailOrPhone.trim(), "phoneNumber": emailOrPhone.trim(), "token": await response.text() }));
        
        setTimeout(() => {
          router.push('/')
        }, 500);
      })
    } catch (ex) {
      console.log(ex)
      Swal.fire({
        title: 'Thông báo',
        text: 'Đã có lỗi xảy ra. Vui lòng thử lại !',
        icon: 'error'
      })
    }
  }, [emailOrPhone, password, userData])

  return (
    <>
      <title>Login</title>
      <FormWithShopLogoC inputArr={_inputArr} 
        inputBtn={<Input type='submit' value="Xác nhận" />} 
        inputJustifyBtn={"center"} 
        onSubmitMethod={onInputSubmit} />
    </>
  )
}
