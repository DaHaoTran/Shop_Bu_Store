"use client"
import React, { useCallback, useEffect, useState } from 'react'
import FormWithShopLogoC from '../../components/FormWithShopLogoC'
import { Input } from 'reactstrap'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { createUser } from '../../stores/user/userSlice'
import { useRouter } from 'next/navigation'
import bcrypt from "bcryptjs";

export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [_inputValueProper, _setInputValueProper] = useState('Tiếp theo')
  const [_inputJustifyBtn, _setInputJustifyBtn] = useState('left')
  const [_inputArr, _setInputArr] = useState(
    [
      {
        label: "Hãy nhập số điện thoại",
        type: "text",
        setValue: setPhoneNumber,
        isRequired: true
      }
    ])
  const dispatch = useDispatch();
  const router = useRouter();

  const enCryptPassword = async (plainTextPassword, salt) => {
    return await bcrypt.hashSync(plainTextPassword, salt);
  }

  const onInputSubmit = useCallback((e) => {
    document.getElementsByTagName('input')[0].value = null
    e.preventDefault();
    if (isNaN(phoneNumber) || Object.keys(phoneNumber).length < 10) {
      _setInputArr([
        {
          label: "Hãy nhập số điện thoại",
          type: "text",
          setValue: setPhoneNumber,
          isRequired: true
        }
      ])
      return
    }
    else if (email == null) {
      _setInputArr([{
        label: "Hãy nhập email",
        type: "email",
        setValue: setEmail,
        isRequired: true
      }])
      return
    }
    else if (password == null) {
      _setInputArr([{
        label: "Hãy nhập mật khẩu",
        type: "password",
        setValue: setPassword,
        isRequired: true
      }])

      _setInputJustifyBtn("center")
      _setInputValueProper("Hoàn tất")
      return
    }

    Swal.fire({
      title: "Thông báo",
      text: "Xác nhận đăng ký ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3227ffff",
      cancelButtonColor: "rgba(42, 42, 42, 1)",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Nghĩ lại"
    }).then(async(result) => {
      if (!result.isConfirmed) return
      dispatch(createUser({
        cart: [],
        information: {
          "email": email,
          "phoneNumber": phoneNumber,
          "password": await enCryptPassword(password, 10)
        },
        address: []
      }))

      Swal.fire({
        title: "Thông báo",
        text: "Đăng ký tài khoản thành công !",
        icon: "success"
      });

      router.push('/#')
    });
  }, [phoneNumber, email, password])

  return (
    <>
      <title>Register</title>
      <FormWithShopLogoC inputArr={_inputArr}
        inputBtn={<Input id='submit-ipt' type='submit'
          value={_inputValueProper} />}
        inputJustifyBtn={_inputJustifyBtn}
        onSubmitMethod={onInputSubmit} />
    </>
  )
}
