import { useEffect, useState } from "react";
import { getOneActivity, moderateOneActivity } from "../../api/activity";
import { useParams } from "react-router-dom";
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";
import { Navigate} from "react-router-dom"


const ModerateActivity = () => {
  const [activity, setActivity] = useState(null)
  const params = useParams()
  const [status, setStatus] = useState("invalidé")
  const [explanation, setExplanation] = useState("")
  const [redirect, setRedirect] = useState(null)

  useEffect( () => {
    getOneActivity(params.id)
    .then((res) => {
      if (res.status === 200){
        setActivity(res.activity)
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
    moderateOneActivity(data, params.id)
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

  if (activity !== null) {
    return (
      <>
        <h1>Modérer le contenu de l'activité n° {activity.id}</h1>
        <h2>Voici les informations de l'activité:</h2>
        <p>Titre de l'activité: {activity.title}</p>
        <p>Description de l'activité: {activity.description}</p>
        { activity.urlPicture !== null ?
        <CloudinaryContext cloudName="dptcisxbs">
          <div>
            <Image className="details-image" publicId={activity.urlPicture} >
              <Transformation quality="auto" fetchFormat="auto" />
            </Image>
          </div>
        </CloudinaryContext> : <p>L'auteur de l'activité n'a pas chargé de photo.</p>}
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <fieldset>
            <legend>Souhaitez-vous valider la publication de l'activité ?</legend>
            <input name="status" type="radio" value="en ligne" checked={status === "en ligne"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Oui</label>
            <input name="status" type="radio" value="invalidé" checked={status === "invalidé"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Non</label>
          </fieldset>
          <label htmlFor="explanation">Indiquez à l'auteur ce qui est à modifier pour que l'annonce soit publiée.</label>
          <textarea type="text" name="explanation" rows="5" cols="33" disabled={status === "en ligne" ? true : false} onChange={(e) => {handleChange(e)}}></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </>
    )
  }
}

export default ModerateActivity;
