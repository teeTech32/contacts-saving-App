import React from 'react'
import { FaHome } from "react-icons/fa"
import { useContext } from 'react'
import contactContext from '../../contexts/ContactContext'

function Notfound() {
  const { setViewProfile } = useContext(contactContext)

  const closeNotfound = ()=>{
    setViewProfile(false)
    window.location.reload()
  }

  return (
    <div class ="flex justify-center">
      <div class="container bg-gray-200 shadow-2xl border-solid  border-black mx-auto mt-10 rounded-3xl border- ">
        <div class='hero'>
          <div class="text-center hero-content">
            <div class="max-w-md">
              <h1 class="text-8xl font-bold  text-red-500 mb-4">Oops!</h1>
              <p class="text-3xl mb-4  text-black-500">Something went wrong. The requested contact ID doesn't exist!.</p>
              <button onClick={closeNotfound} class='btn bg-red-500 btn-lg  text-white text-2xl'>
                <FaHome class="text-3xl" />
                <p>Go Back </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notfound