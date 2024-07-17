import { useContext } from "react";
import { useNavigate, useParams} from "react-router-dom";
import contactContext from "../../contexts/ContactContext";
import DeletIcon from "../ReactIcons/DeleteIcon"
 
function PopButton(){
  const params = useParams()
  const navigate = useNavigate()
  const {setAddform, setIsuser } = useContext(contactContext)

  const username = params.username 

const handleForm = ()=>{
  setAddform(true)
  navigate(`/contactForm/${username}`)  
}

  return <div class="flex justify-center ">
            <div class="max-w-64  card-body">
              <div class=" bg-pink-300 rounded-t-3xl hover:bg-blue-500  rounded-bl-3xl shadow-2xl text-base-content mt-5 relative">
              <DeletIcon onClick={()=>
                {navigate(`/user/${username}`)
                setIsuser(true)}  } class="absolute text-2xl font-bold top-1 right-0 hover:bg-red-600 cursor-pointer rounded-tr-3xl" />
                <h2 class="font-bold font-sans  hover:text-white text-black text-2xl p-2 item-center inline-flex mt-2">Hi !, would you like to add more contacts?</h2>
                <button class=" btn btn-sm bg-blue-500 hover:bg-pink-300 hover:text-black rounded-full text-white font-bold m-2" onClick={handleForm}>Add</button>
              </div>
            </div>
         </div>
}
export default PopButton