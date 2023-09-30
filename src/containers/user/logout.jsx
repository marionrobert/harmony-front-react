import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../slices/userSlice"
import { cleanBasket } from "../../slices/basketSlice"
import { useEffect } from "react"


const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    window.localStorage.removeItem('harmony-token')
    dispatch(logoutUser())
    dispatch(cleanBasket())
    navigate("/login")
  }, [dispatch, navigate])

  return (
    <></>
  )
}

export default Logout
