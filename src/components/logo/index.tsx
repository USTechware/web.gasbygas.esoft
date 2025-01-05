import { CylinderIcon } from 'lucide-react'
import React from 'react'

export default function Logo() {
    return (
        <div className="flex justify-center">
            <div className="text-md font-bold text-[rgb(31,156,237)] dark:text-blue-400">
                <div className='border p-1 radius:md bg-grey flex justify-start items-center '>
                    <img src='/LogoIcon.png' style={{ maxWidth: 25}}/>
                    <span className='ml-2'>GASBYGAS</span>
                </div>
            </div>
        </div>
    )
}
