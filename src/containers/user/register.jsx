import { useEffect, useState } from "react";
import * as yup from 'yup';
import { saveUser } from "../../api/user";

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] =  useState("")
  const [confirmedPassword, setConfirmedPassword] = useState("")
  const [phone, setPhone] =useState("")

  const schema = yup.object().shape({
    firstName: yup.string().required('Le prénom est requis'),
    lastName: yup.string().required('Le nom est requis'),
    email: yup.string().email('Veuillez entrer une adresse email valide (ex: exemple@domaine.com)').required('L\'email est requis'),
    password: yup.string().min(6, 'Le mot de passe doit avoir au moins 6 caractères').required('Le mot de passe est requis'),
    confirmedPassword: yup.string().oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas').required('La confirmation du mot de passe est requise'),
    phone: yup.string()
      .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit avoir 10 chiffres')
      .required('Le numéro de téléphone est requis')
  });

  const [errorPhone, setErrorPhone] = useState(null)
  const [errorFirstName, setErrorFirstName] = useState(null)
  const [errorLastName, setErrorLastName] = useState(null)
  const [errorEmail, setErrorEmail] = useState(null)
  const [errorPassword, setErrorPassword] = useState(null)
  const [errorConfirmedPassword, setErrorConfirmedPassword] = useState(null)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(()=> {
    setError(null)
    if (password !== "" && confirmedPassword !== "" && password !== confirmedPassword){
        setErrorPassword("Les mots de passe ne sont pas identiques.")
        setErrorConfirmedPassword("Les mots de passe ne sont pas identiques.")
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setErrorFirstName(null)
    setErrorLastName(null)
    setErrorPassword(null)
    setErrorConfirmedPassword(null)
    setErrorEmail(null)
    setErrorPhone(null)

    try {
      await schema.validate({
        firstName,
        lastName,
        email,
        password,
        confirmedPassword,
        phone,
      }, { abortEarly: false });

      // Si la validation réussit, vous pouvez maintenant envoyer les données au serveur
      let data = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "phone": phone
      }

      saveUser(data)
        .then((res) => {
          if (res.status === 200) {
            setSuccess("Félicitations, votre compte a bien été créé. Un mail vous a été envoyé à l'adresse renseignée pour valider votre compte.");
            document.querySelector("#form-register").reset();
          } else {
            setError(`Une erreur est survenue: ${res.msg}`);
          }
        })
        .catch((err) => {
          console.log(err);
          setError(`Une erreur est survenue.`);
        });
    } catch (validationErrors) {
      validationErrors.inner.forEach((error) => {
        switch (error.path) {
          case "firstName":
            setErrorFirstName(error.message)
            break;
          case "lastName":
            setErrorLastName(error.message)
            break;
          case "email":
            setErrorEmail(error.message)
            break;
          case "password":
            setErrorPassword(error.message)
            break;
          case "confirmedPassword":
            setErrorConfirmedPassword(error.message)
            break;
          case "phone":
            setErrorPhone(error.message)
            break;
        }
      });
    }
  }

  return (
    <section className="login-register">
      <h1>Créer votre compte Harmony</h1>
      { error !== null && <p className="error">{error}</p>}
      { success !== null && <p>{success}</p>}

      <form onSubmit={(e)=>{handleSubmit(e)}} id="form-register">
        <label htmlFor="firstName">Votre prénom</label>
        <input type="text" name="firstName" onChange={handleChange} />
        {errorFirstName !== null && <p className="error">{errorFirstName}</p>}
        <label htmlFor="lastName">Votre nom</label>
        <input type="text" name="lastName" onChange={handleChange} />
        {errorLastName !== null && <p className="error">{errorLastName}</p>}
        <label htmlFor="email">Votre adresse email</label>
        <input type="text" name="email" onChange={handleChange} />
        {errorEmail !== null && <p className="error">{errorEmail}</p>}
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" onChange={handleChange} />
        {errorPassword !== null && <p className="error">{errorPassword}</p>}
        <label htmlFor="confirmedPassword">Confirmation du mot de passe</label>
        <input type="password" name="confirmedPassword" onChange={handleChange} />
        {errorConfirmedPassword !== null && <p className="error">{errorConfirmedPassword}</p>}
        <label htmlFor="phone">Votre numéro de téléphone</label>
        <input type="text" name="phone" onChange={handleChange} />
        {errorPhone !== null && <p className="error">{errorPhone}</p>}
        <button type="submit">Valider</button>
      </form>
    </section>
  )
}

export default Register;
