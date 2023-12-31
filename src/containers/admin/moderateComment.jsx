import { useEffect, useState } from "react";
import { getOneCommentById, moderateOneComment} from "../../api/comment"
import { useParams } from "react-router-dom";
import { Navigate} from "react-router-dom";


const ModerateComment = () => {
  const [comment, setComment] = useState(null)
  const params = useParams()
  const [status, setStatus] = useState("invalidated")
  const [explanation, setExplanation] = useState("")
  const [redirect, setRedirect] = useState(null)
  const [errorForm, setErrorForm] = useState(null)
  const [errorStatus, setErrorStatus] = useState(null)
  const [errorExplanation, setErrorExplanation] = useState(null)

  useEffect( () => {
    setErrorForm(null)
    getOneCommentById(params.id)
    .then((res) => {
      if (res.status === 200){
        setComment(res.comment)
      }
    })
    .catch((err) => console.log(err))
  }, [params, status])

  const handleSubmit = async(e) => {
    e.preventDefault()
    setErrorForm(null)
    setErrorStatus(null)
    setErrorStatus(null)

    if (status === "") {
      setErrorStatus("Veuillez choisir une option.")
    } else {
      if (status === "invalidated" && explanation === "") {
        setErrorExplanation("Si vous ne validez pas le commentaire, l'expliquation est requise.")
      } else {
        let data = {
          "status": status,
          "explanation": explanation
        }

        moderateOneComment(params.id, data)
        .then((res) => {
          if (res.status === 200){
            setRedirect(true)
          } else {
            setErrorForm("Une erreur est survenue.")
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorForm("Une erreur est survenue.")
        });
      }
    }
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
      <section className="moderate">
        <h1>Modérer le contenu d'un commentaire</h1>
        <article className="comment-data">
          <h2>Informations du commentaire n°{comment.id}</h2>
          <p><span style={{"fontWeight": "bold"}}>Titre :</span> « {comment.title} »</p>
          <p><span style={{"fontWeight": "bold"}}>Description :</span> « {comment.content} »</p>
        </article>
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          {errorForm !== null && <p className="error">{errorForm}</p>}
          <fieldset>
            <legend>Souhaitez-vous valider le commentaire?</legend>
            <input name="status" id="status-yes" type="radio" value="validated" checked={status === "validated"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status-yes">Oui</label>
            <input name="status" id="status-no" type="radio" value="invalidated" checked={status === "invalidated"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status-no">Non</label>
            {errorStatus !== null && <p className="error">{errorStatus}</p>}
          </fieldset>
          <div>
            <span>
              <label htmlFor="explanation">Indiquez à l'auteur ce qui est à modifier pour que le commentaire soit validé.</label>
            </span>
            <textarea name="explanation" id="explanation" rows="5" cols="33" disabled={status === "validated" ? true : false} onChange={(e) => {handleChange(e)}}></textarea>
            {errorExplanation !== null && <p className="error">{errorExplanation}</p>}
          </div>
          <button aria-label="Envoyer les raisons à l'utilisateur" type="submit">Envoyer</button>
        </form>
      </section>
    )
  }
}

export default ModerateComment;
