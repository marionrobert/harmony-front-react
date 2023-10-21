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
  const [status, setStatus] = useState("invalidated")
  const [explanation, setExplanation] = useState("")
  const [redirect, setRedirect] = useState(null)
  const [errorForm, setErrorForm] = useState(null)
  const [errorStatus, setErrorStatus] = useState(null)
  const [errorExplanation, setErrorExplanation] = useState(null)

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

  if (activity !== null) {
    return (
      <section className="moderate">
        <h1>Modérer le contenu d'une activité </h1>
        <article className="activity-data">
          <h2>Informations de l'activité n° {activity.id}</h2>
          <p><span style={{"fontWeight": "bold"}}>Titre :</span> {activity.title}</p>
          <p><span style={{"fontWeight": "bold"}}>Description:</span> {activity.description}</p>
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
          {errorForm !== null && <p className="error">{errorForm}</p>}
          <fieldset>
            <legend>Souhaitez-vous valider la publication de l'activité ?</legend>
            <input name="status" type="radio" value="online" checked={status === "online"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Oui</label>
            <input name="status" type="radio" value="invalidated" checked={status === "invalidated"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="status">Non</label>
            {errorStatus !== null && <p className="error">{errorStatus}</p>}
          </fieldset>
          <div>
            <span>
              <label htmlFor="explanation">Indiquez à l'utilisateur ce qui est à modifier pour que l'annonce soit publiée.</label>
            </span>
            <textarea type="text" name="explanation" rows="5" cols="33" disabled={status === "online" ? true : false} onChange={(e) => {handleChange(e)}}></textarea>
            {errorExplanation !== null && <p className="error">{errorExplanation}</p>}
          </div>
          <button aria-label="Envoyer les raisons à l'utilisateur" type="submit">Envoyer</button>
        </form>
      </section>
    )
  }
}

export default ModerateActivity;
