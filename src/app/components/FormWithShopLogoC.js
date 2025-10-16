"use client"
import Image from "next/image"
import { Card, Input, Label, Form } from "reactstrap"
import './FormWithShopLogoC.css'

export default function FormWithShopLogoC({inputArr, inputBtn, inputJustifyBtn, onSubmitMethod}) {
  return (
    <Card className="form-card p-4 text-white">
      <div className="d-flex justify-content-center">
        <Image
          src="/logo.png"
          width={150}
          height={65}
          priority
          alt="A logo"
        />
      </div>
      <Form onSubmit={(e) => onSubmitMethod(e)}>
        {inputArr.map((x, idx) => (
          <div key={idx} className="my-2">
            <Label className="fs-5">{x.label}</Label>
            <Input type={x.type} onChange={(e) => x.setValue(e.target.value)} required={x.isRequired} />
          </div>
        ))}
        <div className={"d-flex mb-2 mt-3 justify-content-" + inputJustifyBtn}>
          <div className="w-50">
            {inputBtn}
          </div>
        </div>
      </Form>
    </Card>
  )
}
