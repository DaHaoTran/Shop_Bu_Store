"use client"
import React, { useCallback, useEffect, useState } from 'react'
import FormWithShopLogoC from '../../components/FormWithShopLogoC'
import { Input } from 'reactstrap'
import useFetch from '../../hooks/useFetch'
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { createUser } from '../../stores/user/userSlice'

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const { data } = useFetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/user`)
  const [userData, setUserData] = useState(null);
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
      if (!userData) return
      if (emailOrPhone.trim() === userData.email || emailOrPhone.trim() === userData.phoneNumber) {
        if (await comparePasswordHash(password, userData.password)) {
          dispatch(createUser({userData}))

          Swal.fire({
            title: 'Thông báo',
            text: 'Đăng nhập thành công !',
            icon: 'success'
          })

          setTimeout(() => {
            router.push('/')
          }, 500);

          return
        }
      }

      Swal.fire({
        title: 'Thông báo',
        text: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin !',
        icon: 'info'
      })
    } catch {
      Swal.fire({
        title: 'Thông báo',
        text: 'Đã có lỗi xảy ra. Vui lòng thử lại !',
        icon: 'error'
      })
    }
  }, [emailOrPhone, password, userData])

  useEffect(() => {
    if (!data) return
    setUserData(data.information);
  }, [data])

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
