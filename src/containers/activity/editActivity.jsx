import { useState, useEffect } from "react";
import { getOneActivity, updateOneActivity, getCoords, getAllOnlineActivities } from "../../api/activity";
import { getAllCategories } from "../../api/category";
import { setOnlineActivities } from "../../slices/activitySlice";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";
import * as yup from 'yup';


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

  const [errorPhoto, setErrorPhoto] = useState(null)
  const [successPhoto, setSuccessPhoto] = useState(null)
  const [errorForm, setErrorForm] = useState(null)
  const [errorAddressNotFound, setErrorAddressNotFound] = useState(null)

  const [redirect, setRedirect] = useState(null)

  const schema = yup.object().shape({
    categoryId: yup.string().required('Veuillez choisir une catégorie.'),
    authorIsProvider: yup.string().required('Veuillez choisir une option.'),
    title: yup.string()
      .max(80, "Le titre ne doit pas dépasser 80 caractères.")
      .matches(/^[a-zA-Z0-9\séèêîïàâôûùç':.,!?-]*$/, 'Le champ ne peut pas contenir de caractères spéciaux.')
      .test('no-script', 'Vous ne pouvez pas intégrer de script.', value => !value.toLowerCase().includes('script'))
      .required("Le titre est requis"),
    description: yup.string()
      .max(200, "La description ne doit pas dépasser 200 caractères.")
      .matches(/^[a-zA-Z0-9\séèêîïàâôûùç':.,!?-]*$/, 'Le champ ne peut pas contenir de caractères spéciaux.')
      .test('no-script', 'Vous ne pouvez pas intégrer de script.', value => !value.toLowerCase().includes('script'))
      .required("La description est requise"),
    address: yup.string()
      .max(120, "L'adresse ne doit pas dépasser 120 caractères.")
      .required("L'adresse est requise"),
    zip: yup.string()
      .max(6, "Le code postal ne doit pas dépasser 6 caractères. N'oubliez pas de supprimer les espaces.")
      .matches(/^[a-zA-Z0-9\séèêîïàâôûùç':.,!?-]*$/, 'Le champ ne peut pas contenir de caractères spéciaux.')
      .test('no-script', 'Vous ne pouvez pas intégrer de script.', value => !value.toLowerCase().includes('script'))
      .required('Le code postal est requis.'),
    city: yup.string()
      .max(120, "La ville ne doit pas dépasser 120 caractères.")
      .test('no-script', 'Vous ne pouvez pas intégrer de script.', value => !value.toLowerCase().includes('script'))
      .required("La ville est requise"),
    duration: yup.string().required("Veuillez choisir une durée.")
  });

  const [errorCategory, setErrorCategory] = useState(null)
  const [errorProvider, setErrorProvider] = useState(null)
  const [errorTitle, setErrorTitle] = useState(null)
  const [errorDescription, setErrorDescription] = useState(null)
  const [errorAddress, setErrorAddress] = useState(null)
  const [errorZip, setErrorZip] = useState(null)
  const [errorCity, setErrorCity] = useState(null)
  const [errorDuration, setErrorDuration] = useState(null)

  useEffect(()=>{
    setErrorForm(null)
    setErrorPhoto(null)
    setSuccessPhoto(null)
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
      setAuthorIsProvider(res.activity.authorIsProvider === 1 ? "true" : "false")
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
    setErrorPhoto(null)
    setSuccessPhoto(null)
    setErrorCategory(null)
    setErrorProvider(null)
    setErrorTitle(null)
    setErrorDescription(null)
    setErrorAddress(null)
    setErrorZip(null)
    setErrorCity()
    setErrorDuration(null)

    if (address === "" && zip === "" && city === ""){
      setErrorAddressNotFound("Vous devez renseigner une adresse.")
    } else {
      getCoords(address, city)
      .then( async(res) =>{
        if (res.features.length <= 0){
          setErrorAddressNotFound("Nous n'avons pas trouvé l'adresse renseignée.")
        } else {
          let lat = res.features[0].geometry.coordinates[1]
          let lng = res.features[0].geometry.coordinates[0]

          let points = parseInt(duration) / 30

          try {
            await schema.validate({
              categoryId,
              authorIsProvider,
              title,
              description,
              address,
              zip,
              city,
              duration,
            }, { abortEarly: false });

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
          } catch (validationErrors) {
            validationErrors.inner.forEach((error) => {
              switch (error.path) {
                case "categoryId":
                  setErrorCategory(error.message)
                  break;
                case "authorIsProvider":
                  setErrorProvider(error.message)
                  break;
                case "title":
                  setErrorTitle(error.message)
                  break;
                case "description":
                  setErrorDescription(error.message)
                  break;
                case "address":
                  setErrorAddress(error.message)
                  break;
                case "zip":
                  setErrorZip(error.message)
                  break;
                case "city":
                  setErrorCity(error.message)
                  break;
                case "duration":
                  setErrorDuration(error.message)
                  break;
              }
            });
          }
        }
      })
      .catch((err) => console.log(err))
    }
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
        setZip(e.currentTarget.value.replace(/\s/g, ''))
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
        setSuccessPhoto("La photo a bien été chargée.")
      } else {
        if (successPhoto === null){
          setErrorPhoto("Erreur de chargement de la photo.")
        }
      }
  }

  if (redirect){
    return <Navigate to={`/activity/details/${activity.id}`} />
  }

  return (
    <section className="create-update-activity">
      <h1>Modifier une activité</h1>
      {errorForm !== null && <p className="error">{errorForm}</p>}


      { categories.length > 0 && activity !== null &&
      <form onSubmit={(e)=>{handleSubmit(e)}}>
        <label htmlFor="category_id">Catégorie :</label>
        <select name="category_id" onChange={handleChange} defaultValue={categoryId} >
          <option value="">Choisissez une catégorie: </option>
          { categories.map(category=> {
            return (<option key={category.id} value={category.id}>{category.title} </option>)
          })}
        </select>
        {errorCategory !== null && <p className="error">{errorCategory}</p>}

        <fieldset className="provider-or-not">
          <legend>Etes-vous fournisseur de l'activité ?</legend>
          <input type="radio" name="authorIsProvider" value={true} checked={authorIsProvider === "true"} onChange={handleChange} />
          <label htmlFor="authorIsPorvider">Oui</label>
          <input type="radio" name="authorIsProvider" value={false} checked={authorIsProvider === "false"} onChange={handleChange} />
          <label htmlFor="authorIsPorvider">Non</label>
          {errorProvider !== null && <p className="error">{errorProvider}</p>}
        </fieldset>

        <label htmlFor="title">Titre</label>
        <input type="text" name="title" onChange={handleChange} defaultValue={title} />
        {errorTitle !== null && <p className="error">{errorTitle}</p>}

        <label htmlFor="description">Description</label>
        <textarea type="text" name="description" rows="5" cols="33" onChange={handleChange} defaultValue={description} ></textarea>
        {errorDescription !== null && <p className="error">{errorDescription}</p>}

        <fieldset className="location">
          <legend>Lieu de rendez-vous</legend>
          {errorAddressNotFound !== null && <p className="error">{errorAddressNotFound}</p>}
          <label htmlFor="address">Adresse</label>
          <input type="text" name="address" onChange={handleChange} defaultValue={address} />
          {errorAddress !== null && <p className="error">{errorAddress}</p>}
          <label htmlFor="zip">Code postal</label>
          <input type="text" name="zip" onChange={handleChange} defaultValue={zip} />
          {errorZip !== null && <p className="error">{errorZip}</p>}
          <label htmlFor="city">Ville</label>
          <input type="text" name="city" onChange={handleChange} defaultValue={city} />
          {errorCity !== null && <p className="error">{errorCity}</p>}
        </fieldset>

        <label htmlFor="duration">Durée de l'activité </label>
        <select name="duration" onChange={handleChange} defaultValue={duration !== "" ? parseInt(duration) : duration} >
          <option value="">Choisissez une durée</option>
          <option value={30} >30 minutes</option>
          <option value={60} >1 heure</option>
          <option value={90} >1 heure et 30 minutes</option>
          <option value={120} >2 heures</option>
          <option value={150} >2 heures et 30 minutes</option>
          <option value={180} >3 heures</option>
        </select>
        {errorDuration !== null && <p className="error">{errorDuration}</p>}


        { activity.urlPicture !== null ?
          <div>
            <CloudinaryContext cloudName="dptcisxbs">
              <div>
                <Image className="details-image" publicId={activity.urlPicture} alt={`Image de l'activité ${activity.title}`}>
                  <Transformation quality="auto" fetchFormat="auto" />
                </Image>
              </div>
            </CloudinaryContext>
            <button aria-label="Modifier la photo" onClick={(e) => {showWidget(e)}} >
              Modifier la photo
            </button>
          </div>
            :
          <div>
            <button aria-label="Ajouter une photo" onClick={(e) => {showWidget(e)}} >
              Ajouter une photo
            </button>
          </div>
        }
        {successPhoto === null && errorPhoto !== null && <p className="error">{errorPhoto}</p>}
        {successPhoto !== null && <p style={{color:"green"}}>{successPhoto}</p>}
        <button aria-label="Modifier l'activité" className="validate" type="submit">Valider</button>
      </form>
      }



    </section>
  )
}

export default EditActivity;
