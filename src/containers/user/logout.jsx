import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../slices/userSlice"
import { useEffect } from "react"


const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    window.localStorage.removeItem('harmony-token')
    dispatch(logoutUser())
    navigate("/login")
  }, [dispatch, navigate])

  return (
    <></>
  )
}

export default Logout
