import { useEffect, useState } from "react";
import { getOneActivity, moderateOneActivity, getAllOnlineActivities } from "../../api/activity";
import { useParams, Navigate } from "react-router-dom";

import { useDispatch } from "react-redux"
import { setOnlineActivities } from "../../slices/activitySlice";

import { Image, Transformation, CloudinaryContext} from "cloudinary-react";


const ModerateActivity = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const [activity, setActivity] = useState(null)
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
        getAllOnlineActivities()
        .then((response) => {
          if (response.status === 200){
            dispatch(setOnlineActivities(response.activities))
          }
        })
        .catch(error => console.log(error))
      }
      setRedirect(true)
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
      <section className="moderate">
        <h1>Modérer le contenu d'une activité </h1>
        <article className="activity-data">
          <h2>Informations de l'activité n° {activity.id}</h2>
          <p>Titre: {activity.title}</p>
          <p>Description: {activity.description}</p>
        </article>
        { activity.urlPicture !== null ?
        <CloudinaryContext cloudName="dptcisxbs">
          <div>
            <Image className="details-image" publicId={activity.urlPicture} alt={`Image de l'activité ${activity.title}`}>
              <Transformation quality="auto" fetchFormat="auto" />
            </Image>
          </div>
        </CloudinaryContext> : <p>L'auteur de l'activité n'a pas chargé d'image pour son activité.</p>}
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <fieldset>
            <legend>Souhaitez-vous valider la publication de l'activité ?</legend>
            <input name="status" type="radio" value="en ligne" checked={status === "en ligne"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Oui</label>
            <input name="status" type="radio" value="invalidé" checked={status === "invalidé"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Non</label>
          </fieldset>
          <div>
            <label htmlFor="explanation">Indiquez à l'auteur ce qui est à modifier pour que l'annonce soit publiée.</label>
            <textarea type="text" name="explanation" rows="5" cols="33" disabled={status === "en ligne" ? true : false} onChange={(e) => {handleChange(e)}}></textarea>
          </div>
          <button type="submit">Envoyer</button>
        </form>
      </section>
    )
  }
}

export default ModerateActivity;
