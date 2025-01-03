import React from 'react'
import './Dashboard1.css'
import Sidebar from '../components/Sidebar/Sidebar'
import AddVehicle from './AddVehicle'
import AddScratches from './Scratches/Scratches'
import AddDriver from './AddDriver'
import AssignTrip from './AssignTrip'
import WorkshopMovement from './WorkshopMovement'
import ReviewNote from './ReviewNote'
import Settings from '../components/settings'
import DashboardPage from './Dash_overview'


function Dashboard1() {
  return (
    <>
      <div className='container'>
        <div className=""><Sidebar /></div>
        <div className="">
          <section id="Dashboard1">
            <div>
              <DashboardPage />
            </div>
          </section>
          <section id='vehicle'>
            <AddVehicle />
          </section>
          <section id='scratches'>
            <AddScratches />
          </section>
          <section id='driver'>
            <AddDriver />
          </section>
          <section id="tripss">
            <AssignTrip />
          </section>
          <section id="worksho">
            <WorkshopMovement />
          </section>
          <section id="notess">
            <ReviewNote />
          </section>
          <section id="settingss">
            <div className='settings-div'>
              <Settings />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Dashboard1