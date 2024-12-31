import React from 'react'
import './Dashboard1.css'
import Sidebar from '../components/Sidebar/Sidebar'
import AddVehicle from './AddVehicle'



function Dashboard1() {
  return (
    <>
      <div className='container'>
        <div className=""><Sidebar /></div>
        <div className="">
          <section id='Dashboard1'>
            <div>Dashboard</div>
          </section>
          <section id='vehicle'>
            <AddVehicle />
          </section>
        </div>
      </div>
    </>
  )
}

export default Dashboard1