import Link from 'next/link'
import React from 'react'
import { Button } from './button'

const SideBarDashboard = () => {
  return (
    <div>
      <aside className='bg-white min-h-full w-full max-w-60 customShadow' >
            <div className='h-32  flex justify-center items-center flex-col'>
                <div className="text-5xl cursor-pointer relative flex justify-center">
                dashboard
                                
                </div>
                <p className=' capitalize text-lg font-semibold'>ten</p>
                <p className='text-sm'>role</p>
            </div>
            {/** navigatetion */}
            <div>
                <nav className='grid p-4'>
                    <Link href={"/dashboard/user"} className='px-2 py-1 hover:bg-slate-100'>Người dùng</Link>
                    <Link href={"/dashboard/waste"} className='px-2 py-1 hover:bg-slate-100'>Rác thải</Link>

                    

                </nav>
            </div>
        </aside>
       
    </div>
  )
}

export default SideBarDashboard
