import { useEffect, useState } from "react";
import { saveUser } from "../../api/user";

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] =  useState("")
  const [confirmedPassword, setConfirmedPassword] = useState("")
  const [phone, setPhone] =useState("")

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(()=> {
    setError(null)
    if (password !== "" && confirmedPassword !== "" && password !== confirmedPassword){
        setError("Les mots de passe ne sont pas identiques.")
    }
  }, [password, confirmedPassword])

  const handleChange = (e) => {
    switch (e.currentTarget.name) {
      case "firstName":
        setFirstName(e.currentTarget.value)
        break;
      case "lastName":
        setLastName(e.currentTarget.value)
        break;
      case "email":
        setEmail(e.currentTarget.value)
        break;
      case "password":
        setPassword(e.currentTarget.value)
        break;
      case "confirmedPassword":
        setConfirmedPassword(e.currentTarget.value)
        break;
      case "phone":
        setPhone(e.currentTarget.value)
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)

    if(firstName === "" || lastName === "" || email === "" || password === "" || confirmedPassword === ""  || phone === ""){
      setError("Tous les champs doivent être remplis!")
    } else if (password !== confirmedPassword) {
      setError("Les mots de passe ne sont pas identiques.")
    } else if (password === confirmedPassword){
      let data = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "phone": phone
      }

      saveUser(data)
      .then((res)=>{
        if (res.status === 200) {
          setSuccess("Félicitations, votre compte a bien été créé. Un mail vous a été envoyé à l'adresse renseignée pour valider votre compte.")
          document.querySelector("#form-register").reset()
        } else {
          setError(`Une erreur est survenue: ${res.msg}`)
        }
      })
      .catch((err)=>{
        console.log(err)
        setError(`Une erreur est survenue.`)
      })
    }
  }

  return (
    <section className="login-register">
      <h1>Créer votre compte Harmony</h1>
      { error !== null && <p className="error">{error}</p>}
      { success !== null && <p>{success}</p>}

      <form onSubmit={(e)=>{handleSubmit(e)}} id="form-register">
        <label htmlFor="firstName">Votre prénom</label>
        <input type="text" name="firstName" onChange={handleChange} required/>
        <label htmlFor="lastName">Votre nom</label>
        <input type="text" name="lastName" onChange={handleChange} required/>
        <label htmlFor="email">Votre adresse email</label>
        <input type="text" name="email" onChange={handleChange} required/>
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" onChange={handleChange} required/>
        <label htmlFor="confirmedPassword">Confirmation du mot de passe</label>
        <input type="password" name="confirmedPassword" onChange={handleChange} required/>
        <label htmlFor="phone">Votre numéro de téléphone</label>
        <input type="text" name="phone" onChange={handleChange} required/>
        <button type="submit">Valider</button>
      </form>
    </section>
  )
}

export default Register;
