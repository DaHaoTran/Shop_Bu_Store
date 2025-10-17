"use client"
import React from 'react'
import { Form, Label, Input, Card } from 'reactstrap'
import './FormBasicC.css'

export default function FormBasicC({ inputArr, onSubmitMethod, title }) {
  return (
    <Card className='form-card p-2 w-50 text-white'> 
      <h3 className='text-center'>{title}</h3>
      <Form onSubmit={(e) => onSubmitMethod(e)}>
        {inputArr.map((x, idx) => (
          <div key={idx} className="m-2">
            <Label className="fs-5">{x.label}</Label>
            <Input type={x.type} 
              defaultValue={x.defaultValue}
              onChange={(e) => x.setValue(e.target.value)} 
              required={x.isRequired} />
          </div>
        ))}
        <div className="d-flex m-2 justify-content-center" >
          <div>
            <Input className='btn btn-info' type='submit' value='Xác nhận' />
          </div>
        </div>
      </Form>
    </Card>
  )
}
