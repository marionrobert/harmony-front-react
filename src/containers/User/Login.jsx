import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { loginUser } from "../../api/user";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice";

const Login = () => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true)

  useEffect(()=>{
    const token = window.localStorage.getItem("harmony-token")
    if (token){
      setRedirect(true)
    }
    if(email !== "" && password !== ""){
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password])

  const handleSubmit = (e) => {
    e.preventDefault()
    let data = {
      "email": email,
      "password": password
    }
    loginUser(data)
    .then((res)=>{
      // console.log("res -->", res)
      if (res.status === 200){
        window.localStorage.setItem("harmony-token", res.token)
        let myUser = res.user
        myUser.token = res.token
        dispatch(setUser(myUser))
        setRedirect(true)
      } else {
        setError(`${res.msg}` )
      }
    })
    .catch((err)=>{
      console.log(err)
      setError("Une erreur est survenue")
    })
  }

  const handleChange = (e) => {
    switch (e.currentTarget.name) {
      case "email":
        setEmail(e.currentTarget.value)
        break;
      case "password":
        setPassword(e.currentTarget.value)
        break;
    }
  }

  return (
    <section className="login-register-edit">
      {redirect && <Navigate to="/" />}
      <h1>Se connecter</h1>
      {error !== null && <p className="error">{error}</p>}
      <form onSubmit={(e)=>{handleSubmit(e)}}>
        <label htmlFor="email">Votre adresse email</label>
        <input type="text" name="email" id="email" onChange={handleChange} required/>
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" id="password" onChange={handleChange} required/>
        <button aria-label="Se connecter" type="submit" disabled={disabled}>Se connecter</button>
      </form>
      <Link to="/forgot">Mot de passe oublié ?</Link>
      <Link to="/register">Vous n'avez pas de compte ? Créez-en un!</Link>
    </section>
  )
}

export default Login
