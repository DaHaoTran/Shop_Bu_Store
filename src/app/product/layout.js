import React from 'react'
import LayoutProvider from '../providers/layoutprovider'

export default function ProductLayout({ children }) {
  return <LayoutProvider>{ children }</LayoutProvider>
}
