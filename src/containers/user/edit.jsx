import { useSelector, useDispatch } from 'react-redux'
import {selectUser, setUser } from "../../slices/userSlice"
import { Navigate, Link } from "react-router-dom";
import { updateUser, getOneUserById } from '../../api/user';
import { useEffect, useState } from 'react';

const EditUser = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [ error, setError] = useState(null)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    if (user !== null){
      setFirstName(user.data.firstName)
      setLastName(user.data.lastName)
      setPhone(user.data.phone)
    }
  }, [user])

  const handleChange = (e) => {
    e.preventDefault()
    switch (e.currentTarget.name) {
      case "firstName":
        setFirstName(e.currentTarget.value)
        break;
      case "lastName":
        setLastName(e.currentTarget.value)
        break;
      case "phone":
        setPhone(e.currentTarget.value)
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(firstName === "" || lastName === "" || phone === ""){
      setError("Tous les champs doivent être remplis!")
    } else {
      let data = {
        "firstName": firstName,
        "lastName": lastName,
        "phone": phone
      }

      updateUser(data, user.data.key_id)
      .then((res) => {
        if (res.status === 200){
          getOneUserById(user.data.id)
          .then((response)=>{
            if (response.status === 200){
              dispatch(setUser(response.user))
              setRedirect(true)
            } else {
              setError(res.msg)
            }
          })
        } else {
          setError(res.msg)
        }
      })
      .catch(() => {setError("Une erreur est survenue.")})
    }
  }

  if (redirect){
    return <Navigate to={`/profile`}/>
  }

  if (user !== null){
    return (<section>
      <h1>Modifier mes informations: </h1>
      <form onSubmit={(e) => {handleSubmit(e)}}>
        <label name="firstName">Votre prénom</label>
        <input name="firstName" defaultValue={firstName} required onChange={handleChange}></input>
        <label name="lastName">Votre nom</label>
        <input name="lastName" defaultValue={lastName} required onChange={handleChange}></input>
        <label name="phone">Votre numéro de téléphone</label>
        <input name="phone" defaultValue={phone} required onChange={handleChange}></input>
        <button>Enregistrer</button>
      </form>
      { error !== null && <p style={{"color": "indianred"}}>{error}</p>}
    </section>)
  }
}

export default EditUser;
