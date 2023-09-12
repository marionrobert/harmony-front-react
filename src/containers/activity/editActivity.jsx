import { useState, useEffect } from "react";
import { getOneActivity, updateOneActivity, getCoords, getAllOnlineActivities } from "../../api/activity";
import { getAllCategories } from "../../api/category";
import { selectUser } from "../../slices/userSlice";
import { setOnlineActivities } from "../../slices/activitySlice";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";

const EditActivity = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const [activity, setActivity] = useState(null)
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [authorIsProvider, setAuthorIsProvider] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [zip, setZip] = useState("")
  const [city, setCity] = useState("")
  const [duration, setDuration] = useState("")
  const [urlPicture, setUrlPicture] = useState(null)

  const [msgError, setMsgError] = useState(null)
  const [ msgSuccess, setMsgSuccess] = useState(null)
  const [errorForm, setErrorForm] = useState(null)

  const [redirect, setRedirect] = useState(null)
  const user = useSelector(selectUser)

  useEffect(()=>{
    setErrorForm(null)
    setMsgError(null)
    setMsgSuccess(null)
    getAllCategories()
    .then((res)=>{
      if (res.status === 200){
        setCategories(res.categories)
      }
    })
    .catch(err => console.log(err))

    getOneActivity(params.id)
    .then((res)=>{
      setActivity(res.activity)
      setCategoryId(res.activity.category_id)
      setTitle(res.activity.title)
      setDescription(res.activity.description)
      setAddress(res.activity.address)
      setZip(res.activity.zip)
      setCity(res.activity.city)
      setDuration(res.activity.duration)
      setUrlPicture(res.activity.urlPicture)
    })
    .catch((err)=>{
      console.log(err)
    })


  }, [params.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorForm(null)

    getCoords(address, city)
    .then((res) =>{
      if (res.features.length <= 0){
        setErrorForm("Nous n'avons pas trouvé l'adresse renseignée.")
      } else {
        let lat = res.features[0].geometry.coordinates[1]
        let lng = res.features[0].geometry.coordinates[0]

        let points = parseInt(duration) / 30

        let data = {
          "category_id": parseInt(categoryId),
          "authorIsProvider": (authorIsProvider === "true"),
          "title": title,
          "description": description,
          "address": address,
          "urlPicture": urlPicture,
          "city": city,
          "zip": zip,
          "lat": lat,
          "lng": lng,
          "duration": duration,
          "points": points
        }

        // console.log(data)

        updateOneActivity(data, params.id)
        .then((response)=>{
          if (response.status === 200){
            getAllOnlineActivities()
            .then((answer)=>{
              if (answer.status === 200){
                dispatch(setOnlineActivities(answer.activities))
              }
            })
            .catch(mistake => console.log(mistake))
            setRedirect(true)
          } else {
            setErrorForm(response.msg)
          }
        })
        .catch((error => console.log(error)))
      }
    })
    .catch((err) => console.log(err))
  }

  const handleChange = (e) => {
    switch (e.currentTarget.name) {
      case "category_id":
        setCategoryId(e.currentTarget.value)
        break;
      case "authorIsProvider":
        setAuthorIsProvider(e.currentTarget.value)
        break;
      case "title":
        setTitle(e.currentTarget.value)
        break;
      case "description":
        setDescription(e.currentTarget.value)
        break;
      case "duration":
        setDuration(e.currentTarget.value)
        break;
      case "address":
        setAddress(e.currentTarget.value)
        break;
      case "zip":
        setZip(e.currentTarget.value)
        break;
      case "city":
        setCity(e.currentTarget.value)
        break;
    }
  }

  //fonction d'affichage de notre interface de chargement d'images/videos de cloudinary
  const showWidget = (e) => {
    e.preventDefault()
    //paramètrage de l'interface
    let widget = window.cloudinary.createUploadWidget(
        {
            cloudName: "dptcisxbs", //nom du repository cloud
            uploadPreset: "harmonyActivitiesCloudinary", //on branche au preset qui va envoyer vers le dossier saas
            maxImageWidth: 800, //on peut paramètrer la taille max de l'image
            cropping: false //recadrage
        },
        (error, result) => {
            if(error){
                console.log(error)
            } else {
              // console.log("result -->", result)
              checkUploadResult(result) //appel de notre callback
            }
        }
    )
    //ouverture de notre interface
    widget.open()
  }

  //fonction callback de cloudinary déclenché lors de l'envoi d'un fichier
  const checkUploadResult = (resultEvent) => {
      // console.log("checkUploadResult", resultEvent)
      if (resultEvent.event === "success"){
        setUrlPicture(resultEvent.info.public_id)
        setMsgSuccess("La photo a bien été chargée.")
      } else {
        if (msgSuccess === null){
          setMsgError("Erreur de chargement de la photo.")
        }
      }
  }

  if (redirect){
    return <Navigate to={`/profile`} />
  }

  return (
    <>
      <h1>Modifier l'activité</h1>
      {errorForm !== null && <p style={{color:"red"}}>{errorForm}</p>}


      { categories.length > 0 && activity !== null &&
      <form onSubmit={(e)=>{handleSubmit(e)}}>
        <label htmlFor="category_id">Catégorie :</label>
        <select name="category_id" onChange={handleChange} defaultValue={categoryId} required>
          <option value="">Choisissez une catégorie: </option>
          { categories.map(category=> {
            return (<option key={category.id} value={category.id}>{category.title} </option>)
          })}
        </select>

        <fieldset>
          <legend>Etes-vous fournisseur de l'activité ?</legend>
          <input type="radio" name="authorIsProvider" value={true} checked={authorIsProvider === true} onChange={handleChange} required/>
          <label htmlFor="authorIsPorvider">Oui</label>
          <input type="radio" name="authorIsProvider" value={false} checked={authorIsProvider === false} onChange={handleChange} required/>
          <label htmlFor="authorIsPorvider">Non</label>
        </fieldset>

        <label htmlFor="title">Titre</label>
        <input type="text" name="title" onChange={handleChange} defaultValue={title} required/>

        <label htmlFor="description">Description</label>
        <textarea type="text" name="description" rows="5" cols="33" onChange={handleChange} defaultValue={description} required></textarea>

        <fieldset>
          <legend>Lieu de rendez-vous</legend>
          <label htmlFor="address">Adresse</label>
          <input type="text" name="address" onChange={handleChange} defaultValue={address} required/>
          <label htmlFor="zip">Code postal</label>
          <input type="text" name="zip" onChange={handleChange} defaultValue={zip} required/>
          <label htmlFor="city">Ville</label>
          <input type="text" name="city" onChange={handleChange} defaultValue={city} required/>
        </fieldset>

        <label htmlFor="duration">Durée de l'activité : </label>
        <select name="duration" onChange={handleChange} defaultValue={parseInt(duration)} required>
          <option value="">Choisissez une durée</option>
          <option value={30} >30 minutes</option>
          <option value={60} >1 heure</option>
          <option value={90} >1 heure et 30 minutes</option>
          <option value={120} >2 heures</option>
          <option value={150} >2 heures et 30 minutes</option>
          <option value={180} >3 heures</option>
        </select>


        { activity.urlPicture !== null ?
          <div>
            <CloudinaryContext cloudName="dptcisxbs">
              <div>
                <Image className="details-image" publicId={activity.urlPicture} alt={`Image de l'activité ${activity.title}`}>
                  <Transformation quality="auto" fetchFormat="auto" />
                </Image>
              </div>
            </CloudinaryContext>
            <button onClick={(e) => {showWidget(e)}} >
              Modifier la photo d'illustration
            </button>
          </div>
            :
          <div>
            <button onClick={(e) => {showWidget(e)}} >
              Ajouter une photo d'illustration
            </button>
          </div>
        }
        {msgSuccess === null && msgError !== null && <p style={{color:"red"}}>{msgError}</p>}
        {msgSuccess !== null && <p style={{color:"green"}}>{msgSuccess}</p>}

        <hr></hr>
        <hr></hr>
        <hr></hr>
        <button type="submit">Valider</button>
      </form>
      }



    </>
  )
}

export default EditActivity;
