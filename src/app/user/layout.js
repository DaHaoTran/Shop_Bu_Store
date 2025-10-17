import React from 'react'
import LayoutProvider from '../providers/layoutprovider'

export default function UserLayout({ children }) {
  if(typeof window !== 'undefined') return null
  return <LayoutProvider>{children}</LayoutProvider>
}
