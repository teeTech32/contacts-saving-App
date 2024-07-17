import { useContext, useState, useEffect, useRef} from "react";
import { GrEdit } from "react-icons/gr";
import { Link, useNavigate, useParams} from "react-router-dom";
import contactContext from "../../contexts/ContactContext";
import { BiSolidUser } from "react-icons/bi";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import Spinner from "../Layouts/Spinner";

function User(){
  const [editName, setEditName] = useState(false)
  const [editUserImage, setEditUserImage] = useState(null)
  const [editUser, setEditUser] = useState({
    full_name: '',
  })

  const { user, isuser, setIsuser, userContacts, fetchUser, isloading, setIsloading, fetchUsercontacts }=useContext(contactContext)
  const  {username, date_created, user_image} = user
  const {full_name} = editUser

  const navigate = useNavigate()
  const params = useParams()
  const isMounted = useRef(true)

  useEffect(()=>{
    if(isMounted){
      fetchUser(params.username)
      fetchUsercontacts(params.username)
    }
    return ()=>{
      isMounted.current = false
    }
    // eslint-disable-next-line
  },[])
 
  const onImage = (e) =>{
    setEditUserImage(e.target.files[0]) 
  }
  const onChange = (e) =>{
    setEditUser({
      ...editUser,
      [e.target.id]:e.target.value
    })
  }

  const onSubmit = async(username)=>{
    try{
      if (editUser.full_name === '' && editUserImage!==null){
        setIsloading(true)
        const formData = new FormData();
        formData.append('file', editUserImage, editUserImage.name)
        await fetch(`http://localhost:8000/UpdateUser/${username}`, {
          method: "PATCH",
          body: formData
        })
        setIsloading(false)
        toast.success('Image Successfully Updated')
        fetchUser(username)
        setEditUserImage(null)
        return
      }
      if (editUserImage === null && editUser.full_name!==''){
        setIsloading(true)
        await fetch(`http://localhost:8000/UpdateUserName/${username}?`, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editUser),
        })
        setIsloading(false)
        toast.success('Name Successfully Updated')
        fetchUser(username)
        setEditUser({
          full_name:''
        })
        return
      }
      if (editUserImage !== null && editUser.full_name !== '' ){
        setIsloading(true)
        await fetch(`http://localhost:8000/UpdateUserName/${username}?`, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editUser),
        })
        const formData = new FormData();
        formData.append('file', editUserImage, editUserImage.name)
        await fetch(`http://localhost:8000/UpdateUser/${username}`, {
          method: "PATCH",
          body: formData
        })
        setIsloading(false)
        toast.success('UserDetails Successfully Updated')
        fetchUser(username)
        setEditUser({
          full_name: ''
        })
        setEditUserImage(null)
      }
    }catch(error){
      if(error.response){
        toast.error('Something whent wrong')
      }else if(error.request){
        toast.error('Something whent wrong')
      }else{
        setIsloading(true)
        setTimeout(()=>{
          setIsloading(false)
          toast.error('Check your internet connectivity')
          setEditUser({
            full_name: ''
          })
          setEditUserImage(null)
        }, 2000)
       

      }
    }
  }

  return <ReactModal isOpen={isuser} appElement={document.getElementById('root')} className="style">
   { isloading ? <Spinner/> : <div class=" flex justify-center ">
      <div>
        <div class="w-full mx-auto">
          <div className="user">
            <div class="cursor-pointer" onClick={() => {
              onSubmit(username)
              setEditName((prevState) => !prevState)
            }}>
              <GrEdit class="text-xl text-white float-right m-2 cursor-pointer"/>
            </div>
            <div class="grid  md:grid-col-1 lg:grid-col-1 xl:grid-col-1 m-5">
              <div class=" pt-2 justify-center flex ">
                <div class="h-10 w-52 bg-black rounded  shadow-xl">
                  <div class="text-white font-bold ">
                    <h1 class="pt-2 pl-3 text-center" >
                      User DashBoard
                    </h1>
                  </div>
                </div>
              </div>
              <div class="inline-flex">
                <div class="col-span-2 inline">
                  <div class=" mb-4 mt-7 mr-2 ml-2">
                    <div class=" image-full ">
                      <button onClick={()=>setEditName(true)}>
                        <figure>
                          {editName ? <BiSolidUser class="text-8xl text-gray-300 border-double border-4 border-gray-300 rounded-md" /> : <img src={`https://mybucketcontacts.s3.amazonaws.com/${user_image}`} alt='ProfileImage' class="object-cover h-40 w-30 rounded-md border-double border-4 border-gray-300" /> }
                        </figure>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="align-middle text-black">
                  <div class=" mt-5 mb-5 font-bold p-2">
                    {editName ? <div class="pb-2">Full_Name : <input id="full_name" type="text" value={full_name} class='bg-slate-500 text-white input input-sm rounded-md' onChange={onChange}></input> 
                    </div> : <div class="pb-2">Full_Name : <span class="text-white">{user.full_name}</span></div> }
                    <div class="pb-2">Email : <span class="text-white">{username}</span></div>
                  </div>
                </div>
              </div>
              {editName ? <input type="file" id="file" class="input input-sm mt-2 cursor-pointer w-30 mr-5 ml-5 mb-5 rounded-md bg-slate-500" onChange={onImage} accept='.jpg,.png,.jpeg'></input> : ''}
              <div class="pr-3 pl-3 ">
                <div class="h-10 w-62 bg-gray-300 rounded  shadow-xl">
                  <div class="text-black font-bold ">
                    <h1 class="pt-2 pl-3 " >
                      CreatedDate & Time : {date_created}
                    </h1>
                  </div>
                </div>
              </div>
              <div class="pr-3 pl-3 pt-5 pb-5">
                <div class="h-10 w-56 bg-gray-300 rounded shadow-xl">
                  <div class="text-black font-bold ">
                    <h1 class="pt-2 pl-3" >
                      Registered Contacts : {userContacts.length}
                    </h1>
                  </div>
                </div>
              </div>
              <div class="inline-flex mb-5 ml-10">
                <div className="center">
                  <div className="outer but">
                    <button onClick={() => {
                      setIsuser(false)
                      navigate('/Homepage/')
                      window.location.reload()
                    }}>LogOut</button>
                    <span></span>
                    <span></span>
                  </div>
                  <Link to={`/contact/${username}`}>
                    <div className="outer cir">
                      <button >CreateContact</button>
                      <span></span>
                      <span></span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>}
  </ReactModal>
}

    
    export default User