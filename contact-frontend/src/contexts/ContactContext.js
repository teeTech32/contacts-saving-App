import { createContext, useState } from "react";
import api from '../api'
import { toast } from 'react-toastify'


const contactContext = createContext()

export const ContactProvider = ({children}) =>{
  const [userContacts, setUserContacts] = useState([])
  const [isuser, setIsuser] = useState(false)
  const [getbyId, setGetbyId,] = useState('')
  const [home, setHome] = useState(true)
  const [about, setAbout] = useState(true)
  const [addform, setAddform] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleC, setVisibleC] = useState(false)
  const [viewContacts, setViewContacts] = useState(false)
  const [viewProfile, setViewProfile] = useState(false)
  const [addedit, setAddedit] = useState(false)
  const [editId, setEditId] = useState(null)
  const [handleRemoveContact, setHandleRemoveContact] = useState(false)
  const [contacts, setContacts] = useState([])
  const [contact, setContact] = useState({})
  const [imageEdit, setImageEdit] = useState(null)
  const [removeContact, setRemoveContact] = useState(true)
  const [imageInput, setImageInput] = useState(null)
  const [notfound, setNotfound] = useState(false)
  const [isloading, setIsloading] = useState(false)
  const [login, setLogin] = useState(true)
  const [signin, setSignin] = useState(true)
  const [user, setUser] = useState({})
  const [inputData, setInputData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    country_name: '',
    state_name: '',
    photo_name: '',
    username: ''
  })
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    country_name: '',
    state_name: '',
    photo_name: '',
  })
  const [signinData, setSigninData] = useState({
    full_name:'',
    username: '',
    password: '',
    user_image: '',
   
  })
  const [loginInput, setLoginInput] = useState({
    username:'',
    password:'',
  })

  const fetchUser = async (username) => {
    try {
      const response = await api.get(`/user/${username}`)
      setUser(response.data)
    } catch (error) {
      if (error.response) {
        toast.error('Something whent wrong')
      } else if (error.request) {
        toast.error('Something whent wrong')
      }
    }
  }

  const fetchContacts = async() => {
    try{
      const response = await api.get("/contacts/")
      setContacts(response.data)  
    }catch(error){
      if(error.response){
        toast.error('No contact available yet')
      }else if(error.request){
        toast.error('No contact available yet')
      }
    }
    
  }

  const fetchSingle = async (getbyId) => {
    try {
      const response = await api.get(`/contact/${getbyId}?`)
      setContact(response.data)
      toast.success('Contact was fetched successfully')
    }catch(error){
      if(error.response){
        setNotfound(true)
        toast.error("The requested contact doesn't exist")
      }else if(error.request){
        setNotfound(true)
        toast.error("The requested contact doesn't exist")
      }
    } 
  }

  const popupProfile = async(id) => {
    setIsloading(true)
    const response = await api.get(`/contact/${id}?`)
    setTimeout(()=>{
      setIsloading(false)
      setContact(response.data)
      setViewProfile(true)
    },2000)
    
  }

  const onEditform = async (id) => {
    setAddedit(true)
    const response = await api.get(`/contact/${id}?`)
    const edit = response.data
    setEditId(edit.id)
    setEditData({
      first_name: edit.first_name ,
      last_name: edit.last_name,
      email: edit.email,
      mobile_no: edit.mobile_no,
      country_name: edit.country_name,
      state_name: edit.state_name,
      photo_name: edit.photo_name
    })  
  }

  const fetchUsercontacts = async (username)=>{
    try{
      const response = await api.get(`/userContacts/${username}`)
      setUserContacts(response.data)
    }catch(error){
      if(error.response){
        toast.error('No contacts registered yet') 
      }else if(error.request){
        toast.error('No contacts registered yet') 
      } 
    }
  }
  
  return <contactContext.Provider value={{
              addform,
              addedit,
              contacts,
              contact,
              viewContacts,
              viewProfile,
              removeContact,
              handleRemoveContact, 
              editData,
              editId, 
              inputData, 
              imageInput,
              imageEdit,
              notfound,
              isloading,
              getbyId,
              login,
              loginInput,
              visible,
              signin,
              visibleC,
              about, 
              home,
              signinData,
              user,
              isuser,
              userContacts,
              setIsuser,
              fetchUser,
              setSigninData,
              setUser,
              setHome,
              setAbout,
              setVisibleC, 
              setVisible,
              setSignin,
              setLoginInput,
              setLogin, 
              setGetbyId,
              setIsloading,
              setContacts,
              setImageEdit, 
              setInputData,
              setImageInput ,
              setViewContacts,
              setViewProfile,
              setAddform,
              setAddedit,
              onEditform,
              setEditData,
              setRemoveContact,
              setHandleRemoveContact,
              fetchContacts,
              fetchUsercontacts,
              fetchSingle,
              popupProfile
            }}>
            {children}
         </contactContext.Provider>

}

export default contactContext