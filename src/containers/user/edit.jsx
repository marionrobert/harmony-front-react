import { useSelector, useDispatch } from 'react-redux'
import {selectUser, setUser } from "../../slices/userSlice"
import { Navigate, Link } from "react-router-dom";
import { updateUser, getOneUserById } from '../../api/user';
import { useEffect, useState } from 'react';
import * as yup from 'yup';

const EditUser = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [ error, setError] = useState(null)
  const [redirect, setRedirect] = useState(false)

  const schema = yup.object().shape({
    firstName: yup.string()
      .max(50, "Le prénom ne doit pas dépasser 60 caractères.")
      .required('Le prénom est requis.'),
    lastName: yup.string()
      .max(50, "Le nom ne doit pas dépasser 60 caractères.")
      .required('Le nom est requis.'),
    phone: yup.string()
      .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit avoir 10 chiffres.')
      .required('Le numéro de téléphone est requis.')
  });

  const [errorPhone, setErrorPhone] = useState(null)
  const [errorFirstName, setErrorFirstName] = useState(null)
  const [errorLastName, setErrorLastName] = useState(null)

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

  const handleSubmit = async(e) => {
    e.preventDefault()
    setErrorFirstName(null)
    setErrorLastName(null)
    setErrorPhone(null)

    try {
      await schema.validate({
        firstName,
        lastName,
        phone,
      }, { abortEarly: false });

      // Si la validation réussit, vous pouvez maintenant envoyer les données au serveur
      let data = {
        "firstName": firstName,
        "lastName": lastName,
        "phone": phone
      }

      updateUser(data, user.data.key_id)
      .then((res) => {
        if (res.status === 200){
          dispatch(setUser(res.user))
          setRedirect(true)
        } else {
          setError(res.msg)
        }
      })
      .catch(() => {setError("Une erreur est survenue.")})


    } catch (validationErrors) {
      validationErrors.inner.forEach((error) => {
        switch (error.path) {
          case "firstName":
            setErrorFirstName(error.message)
            break;
          case "lastName":
            setErrorLastName(error.message)
            break;
          case "phone":
            setErrorPhone(error.message)
            break;
        }
      });
    }
  }

  if (redirect){
    return <Navigate to={`/profile`}/>
  }

  if (user !== null){
    return (<section className="login-register-edit">
      <h1>Modifier mes informations: </h1>
      { error !== null && <p className="error">{error}</p>}

      <form onSubmit={(e) => {handleSubmit(e)}}>
        <label htmlFor="firstName">Votre prénom</label>
        <input name="firstName" id="firstName" defaultValue={firstName} required onChange={handleChange}></input>
        {errorFirstName !== null && <p className="error">{errorFirstName}</p>}
        <label htmlFor="lastName" >Votre nom</label>
        <input name="lastName" id="lastName" defaultValue={lastName} required onChange={handleChange}></input>
        {errorLastName !== null && <p className="error">{errorLastName}</p>}
        <label htmlFor="phone" >Votre numéro de téléphone</label>
        <input name="phone" id="phone" defaultValue={phone} required onChange={handleChange}></input>
        {errorPhone !== null && <p className="error">{errorPhone}</p>}
        <button aria-label="Valider la modification de mes informations personnelles" >Enregistrer</button>
      </form>
      { error !== null && <p style={{"color": "indianred"}}>{error}</p>}
    </section>)
  }
}

export default EditUser;
