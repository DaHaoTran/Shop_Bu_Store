import React from 'react'
import LayoutProvider from '../providers/layoutprovider'

export default function ShopLayout({ children }) {
  return <LayoutProvider>{ children }</LayoutProvider>
}
