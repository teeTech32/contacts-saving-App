import { useContext } from "react"
import contactContext from "../../contexts/ContactContext"
import ReactModal from "react-modal"
import DeletIcon from "../ReactIcons/DeleteIcon"
import Notfound from "./Notfound"
function Profile(){

  const { contact, viewProfile, setViewProfile, notfound, } = useContext(contactContext)
  
  const { first_name, last_name, email, mobile_no, country_name, state_name, photo_name } = contact
  
  const closeProfile = ()=>{
    setViewProfile(false)
  }

  return <ReactModal isOpen={viewProfile} appElement={document.getElementById('root')} className="style">
    {notfound ? <Notfound /> 
    : <div class=" flex justify-center  ">
        <div>
          <div class="w-full mx-auto  ">
            <div class="grid  md:grid-col-1 lg:grid-col-1 xl:grid-col-1 mb-8 ">
              <div class="container relative border-8 border-blue-200 hover:border-pink-200 bg-pink-500 hover:bg-blue-500  rounded-xl">
                <DeletIcon onClick={closeProfile} class="absolute text-2xl font-bold top-0 right-0 hover:bg-red-600" />
                <div class="inline-flex">
                  <div class="col-span-2 inline">
                    <div class="gap-5 m-5 font-bold p-2 text-black">
                      <div class="pb-2">First_Name :<span class="text-white ml-2">{first_name}</span></div>
                      <div class="pb-2">Last_Name : <span class="text-white ml-2">{last_name}</span></div>
                      <div class="pb-2"> Email_Address : <span class="text-white ml-2">{email}</span></div>
                      <div class="pb-2"> Mobile_Contact :<span class="text-white ml-2">{mobile_no}</span></div>
                      <div class="pb-2">Country_Name :<span class="text-white ml-2">{country_name}</span> </div>
                      <div> State_Name :<span class="text-white ml-2">{state_name}</span>  </div>
                    </div>
                  </div>
                  <div class="align-middle ">
                    <div class=" mb-4 mt-7 mr-4 ">
                      <div class=" image-full ">
                        <figure>
                          <img src={`https://mybucketcontacts.s3.amazonaws.com/${photo_name}`} alt="ProfileImage" class="object-cover h-60 w-40" />
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    }
</ReactModal>
          

}
export default Profile