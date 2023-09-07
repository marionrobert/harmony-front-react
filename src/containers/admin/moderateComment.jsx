import { useEffect, useState } from "react";
import { getOneCommentById, moderateOneComment} from "../../api/comment"
import { useParams } from "react-router-dom";
import { Navigate} from "react-router-dom"

const ModerateComment = () => {
  const [comment, setComment] = useState(null)
  const params = useParams()
  const [status, setStatus] = useState("invalidé")
  const [explanation, setExplanation] = useState("")
  const [redirect, setRedirect] = useState(null)

  useEffect( () => {
    getOneCommentById(params.id)
    .then((res) => {
      if (res.status === 200){
        setComment(res.comment)
      }
    })
    .catch((err) => console.log(err))
  }, [params, status])

  const handleSubmit = (e) => {
    e.preventDefault()

    let data = {
      "status": status,
      "explanation": explanation
    }
    // console.log("data -->", data)
    moderateOneComment(params.id, data)
    .then((res) => {
      if (res.status === 200){
        setRedirect(true)
      }
    })
    .catch(err => console.log(err))
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.currentTarget.name === "status"){
      setStatus(e.currentTarget.value)
    } else {
      setExplanation(e.currentTarget.value)
    }
  }

  if (redirect){
    return <Navigate to={`/admin`} />
  }

  if (comment !== null) {
    return (
      <>
        <h1>Modérer le contenu du commentaire n° {comment.id}</h1>
        <h2>Voici les informations du commentaire:</h2>
        <p>Titre du commentaire: {comment.title}</p>
        <p>Description du commentaire: {comment.content}</p>
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <fieldset>
            <legend>Souhaitez-vous valider le commentaire?</legend>
            <input name="status" type="radio" value="validé" checked={status === "validé"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Oui</label>
            <input name="status" type="radio" value="invalidé" checked={status === "invalidé"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Non</label>
          </fieldset>
          <label htmlFor="explanation">Indiquez à l'auteur ce qui est à modifier pour que le commentaire soit validé.</label>
          <textarea type="text" name="explanation" rows="5" cols="33" disabled={status === "validé" ? true : false} onChange={(e) => {handleChange(e)}}></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </>
    )
  }
}

export default ModerateComment;
