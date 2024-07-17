import { useNavigate } from "react-router-dom"

function LandingPage(){
  const navigate = useNavigate()

  return <div>
    <div className="styleP"></div>
    <div class=" opacity-100 xl:ml-96 xl:mt-40 lg:ml-80 mt-20 ml-5 md:ml-48 z-50 absolute font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 from-10% via-yellow-300 via-30% to-emerald-500 to-90%  pt-0 mb-60 bg-white">
      <h1 class="text-2xl flex justify-center m-5 hover:text-blue-700 font-bold">Welcome To teeTech Contact Details Saving App</h1>
      <div class="text-xl font-bold">
        <p class="flex justify-center m-5 hover:text-blue-700 ">We are Trusted and Reliabled </p>
        <h4 class="flex justify-center m-5 hover:text-blue-700 " >Save Smarter!!!</h4>
      </div>
      <div className="button">
        <button onClick={() => {
          navigate('/Homepage/')
}}>
          Get Started
        </button>
      </div>
     
    </div>
    </div>
}
export default LandingPage