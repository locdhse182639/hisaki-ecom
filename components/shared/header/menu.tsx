import { ShoppingBagIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Menu() {
  return (
    <div className='flex justify-end'>
        <nav className='flex gap-3 w-full'>
            <Link href='/signin' className='header-button'>
                <UserIcon className='h-8 w-8'/>
                <span className='font-bold'>Sign in</span>
            </Link>

            <Link href='/cart' className='header-button'>
                <ShoppingBagIcon className='h-8 w-8'/>
                <span className='font-bold'>Cart</span>
            </Link>
        </nav>
    </div>
  )
}
