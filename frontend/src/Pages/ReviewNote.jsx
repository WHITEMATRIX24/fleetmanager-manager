import React from 'react'
import AddNote from '../components/addnote'
import NotesDisplay from '../components/Notes'
import './ReviewNote.css'
function ReviewNote() {
    return (
        <>
            <div className="vehicle">

                <div className="content-note">
                    <div className='add-note'>
                        <AddNote />
                    </div>
                    <div className='display-note'>
                        <NotesDisplay />
                    </div>
                </div>

            </div>
        </>
    )
}

export default ReviewNote