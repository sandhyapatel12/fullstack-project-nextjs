import React from 'react'
import { FaUsers } from 'react-icons/fa'

const Card = () => {
  return (
    <div className=' px-10 justify-center bg-white shadow-xl rounded-md w-72 h-52   flex flex-col'>
      <div className='flex items-center justify-center mb-3'>
      <FaUsers className='text-purple-600 h-20 w-20'/>
      </div>

      <h1 className='text-xl font-bold'>Total Users</h1>
      <p>10.28</p>
      <div className='flex space-x-3'>
        <span className='text-green-500 font-bold'>12%</span>
        <p className='text-gray-500 text-sm'>more than previous week</p>
      </div>
    </div>
  )
}

export default Card
