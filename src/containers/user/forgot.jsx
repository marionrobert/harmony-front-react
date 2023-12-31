import { forgotPassword } from "../../api/user";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as yup from 'yup';

const Forgot = () => {
  const [email, setEmail] = useState("")
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true)

  const onSubmitForm = (e) => {
    e.preventDefault()
    let data = {
      email: email
    }
    forgotPassword(data)
    .then((res)=>{
      if (res.status === 200){
        setRedirect(true)
      } else if (res.status === 404) {
        setError("Il n'existe pas d'utilisateur correspondant au mail renseigné. Vérifiez l'orthographe du mail saisi ou inscrivez-vous!")
      } else {
        setError("Une erreur est survenue. Veuillez réessayer ultérieurement.")
      }
    })
    .catch((err)=>{
      setError("Une erreur est survenue. Veuillez réessayer ultérieurement.")
    })
  }

  useEffect(()=>{
    if(email !== ""){
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email])


  return (
    <section className="forgot">
      {redirect && <Navigate to="/login" />}

      <h1>
        Vous avez oublié votre mot de passe ? Pas de panique !
      </h1>

      <form onSubmit={onSubmitForm}>
        <label>Entrez-votre adresse mail pour recevoir un lien de modification de votre mot de passe.</label>
        <input type="text" name="email" onChange={(e) => {setEmail(e.currentTarget.value);}}/>
        <button aria-label="Cliquer pour recevoir un lien de modification de mot de passe" type="submit" disabled={disabled}>Envoyer</button>
      </form>

      {error !== null && <p className="error">{error}</p>}
    </section>
  );
};

export default Forgot;
