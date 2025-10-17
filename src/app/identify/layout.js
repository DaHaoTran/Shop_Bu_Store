import React from 'react'
import './layout.css'
import FormLayoutProvider from '../providers/formlayoutprovider'

export default function IdentifyLayout({ children }) {
  return <div className='regis-container'><FormLayoutProvider>{children}</FormLayoutProvider></div>
}
