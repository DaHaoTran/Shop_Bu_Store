"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function page() {
    const { user } = useSelector(x => x.user);
    const [message, setMessage] = useState('Đang chuyển hướng...');
    const router = useRouter();

    useEffect(() => {
        if (!user) return
        if (Object.keys(user).length <= 0) router.push('/')
        try {
            async function PrepareToAccessShop() {
                let userAPI = null
                //Check exist shop
                var response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/shops/${encodeURIComponent(user.email)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + user.token
                    },
                })
                if (response.ok) {
                    document.location.href = process.env.NEXT_PUBLIC_SECURE_SHOP_DOMAIN;
                    return
                }

                setTimeout(async () => {
                    //Create shop if not exist
                    setMessage('Đang cấp quyền truy cập...')
                    var content = {
                        "userEmail": user.email,
                        "shopName": user.email.substr(0, user.email.indexOf('@')),
                        "image": "string",
                        "status": "new",
                        "isBanned": false
                    }
                    var response2 = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/shops`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + user.token
                        },
                        body: JSON.stringify(content)
                    })
                    if (!response2.ok) router.push('/');
                    document.location.href = process.env.NEXT_PUBLIC_SECURE_SHOP_DOMAIN;
                }, 500);
            }
            PrepareToAccessShop();
        } catch (ex) {
            router.push('/');
        }
    }, [user])

    return (
        <h1>{message}</h1>
    )
}
