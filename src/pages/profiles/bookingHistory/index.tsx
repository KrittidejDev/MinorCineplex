import React from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
const index = () => {
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget/>
      <div>
        <div><ProfileBar/></div>
        <div></div>
      </div>
    </div>
  )
}

export default index
