import { useEffect, useState } from "react";
import { getOneActivity } from "../../api/activity";
import { useParams } from "react-router-dom";
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";


const ModerateActivity = () => {
  const [activity, setActivity] = useState(null)
  const params = useParams()
  const [status, setStatus] = useState("invalidé")
  const [explanation, setExplanation] = useState("")

  useEffect( () => {
    getOneActivity(params.id)
    .then((res) => {
      if (res.status === 200){
        setActivity(res.activity)
      }
    })
    .catch((err) => console.log(err))
  }, [params])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("submit")
  }

  const handleChange = (e) => {
    console.log("change")
    e.preventDefault()
    if (e.currenTarget.name === "status"){
      if (e.currentTarget.value){
        setStatus("en ligne")
        console.log(status)
      } else {
        setStatus("invalidé")
        console.log(status)
      }
    } else {
      setExplanation(e.currentTarget.value)
      console.log(explanation)
    }
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
            <Image className="details-image" publicId={activity.urlPicture} id='profilImg' >
              <Transformation quality="auto" fetchFormat="auto" />
            </Image>
          </div>
        </CloudinaryContext> : <p>L'auteur de l'activité n'a pas chargé de photo.</p>}
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <fieldset>
            <legend>Souhaitez-vous valider la publication de l'activité ?</legend>
            <input name="status" type="radio" value={true} checked onChange={handleChange} required/>
            <label htmlFor="status">Oui</label>
            <input name="status" type="radio" value={false} checked onChange={handleChange} required/>
            <label htmlFor="status">Non</label>
          </fieldset>
          <label htmlFor="explanation">Indiquez à l'auteur pourquoi vous ne validez son annonce.</label>
          <textarea type="text" name="explanation" rows="5" cols="33" required={status === "en ligne" ? false : true} onChange={handleChange}></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </>
    )
  }
}

export default ModerateActivity;
