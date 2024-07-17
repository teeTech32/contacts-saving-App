import { useContext } from "react"
import contactContext from "../../contexts/ContactContext"
import Preview from "./Preview"
import ReactModal from "react-modal"
import DeletIcon from "../ReactIcons/DeleteIcon"

function ContactPreview(){
  const { contacts, viewContacts, setViewContacts }=useContext(contactContext)

  const closeContacts = (e)=>{
    e.preventDefault()
    setViewContacts(false)
  }

  return <ReactModal isOpen={viewContacts} appElement={document.getElementById('root')} className="style" >
    <div class="flex justify-center sm:mt-0">
       <div class="scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-500 h-80 overflow-y-scroll">
        <div class="container border-pink-300 border-8 shadow-2xl rounded-xl " >
          <DeletIcon class="text-xl right-0 top-0 hover:bg-red-500 cursor-pointer" onClick={closeContacts} />
          <div class="grid gap-8  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-5 ">
            {
              contacts.map((contact) => (
                <Preview key={contact.id} contact={contact} />
              )
              )
            }
          </div>
        </div>
      </div>
    </div> 
  </ReactModal>
}
export default ContactPreview