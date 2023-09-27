import { useEffect, useState } from "react"
import { Navigate} from "react-router-dom"
import * as yup from 'yup';
import { getAllCategories } from "../../api/category"
import { saveOneActivity, getCoords } from "../../api/activity"
import { useSelector } from 'react-redux';
import { selectUser} from "../../slices/userSlice"

const AddActivity = () => {
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [authorIsProvider, setAuthorIsProvider] = useState("false")
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
  const [idNewActivity, setIdNewActivity] = useState(null)
  const [redirect, setRedirect] = useState(null)
  const user = useSelector(selectUser)

  const schema = yup.object().shape({
    categoryId: yup.string().required('Veuillez choisir une catégorie.'),
    authorIsProvider: yup.string().required('Veuillez choisir une option.'),
    title: yup.string()
      .max(80, "Le titre ne doit pas dépasser 80 caractères.")
      .required("Le titre est requis"),
    description: yup.string()
      .max(200, "La description ne doit pas dépasser 200 caractères.")
      .required("La description est requise"),
    address: yup.string()
      .max(120, "L'adresse ne doit pas dépasser 120 caractères.")
      .required("L'adresse est requise"),
    zip: yup.string()
      .matches(/^[0-9]{5}$/, 'Le code postal doit comporter 5 chiffres.')
      .required('Le code postal est requis.'),
    city: yup.string()
      .max(120, "La ville ne doit pas dépasser 120 caractères.")
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


  useEffect(() => {
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
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
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
              "author_id": user.data.id,
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

            saveOneActivity(data)
            .then((response)=>{
              if (response.status === 200){
                setIdNewActivity(response.activity.insertId)
                setRedirect(true)
              } else {
                setErrorForm("Une erreur est survenue")
              }
            })
            .catch((err) => {
              console.log(err);
              setErrorForm("Une erreur est survenue")
            });
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
        setSuccessPhoto("La photo a bien été chargée.")
      } else {
        if (successPhoto === null){
          setErrorPhoto("Erreur de chargement de la photo.")
        }
      }
  }

  if (redirect && idNewActivity !== null){
    return <Navigate to={`/activity/details/${idNewActivity}`} />
  }


  return (
    <section className="create-update-activity">
      <h1>Créer une nouvelle activité</h1>
      {errorForm !== null && <p className="error">{errorForm}</p>}

      { categories.length > 0 &&
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <label htmlFor="category_id">Catégorie :</label>
          <select name="category_id" onChange={(e) =>{handleChange(e)}} >
            <option value="">Choisissez une catégorie</option>
            { categories.map(category=> {
              return (<option key={category.id} value={category.id}>{category.title} </option>)
            })}
          </select>
          {errorCategory !== null && <p className="error">{errorCategory}</p>}


          <fieldset className="provider-or-not">
            <legend>Etes-vous fournisseur de l'activité ?</legend>
            <input type="radio" name="authorIsProvider" value={true} checked={authorIsProvider === "true"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="authorIsPorvider">Oui</label>
            <input type="radio" name="authorIsProvider" value={false}
            checked={authorIsProvider === "false"} onChange={(e) =>{handleChange(e)}} />
            <label htmlFor="authorIsPorvider">Non</label>
            {errorProvider !== null && <p className="error">{errorProvider}</p>}
          </fieldset>

          <label htmlFor="title">Titre de l'activité</label>
          <input type="text" name="title" placeholder="Donne cours de pâtisserie" onChange={(e) =>{handleChange(e)}} />
          {errorTitle !== null && <p className="error">{errorTitle}</p>}

          <label htmlFor="description">Description</label>
          <textarea type="text" name="description" placeholder="Je suis très douée en pâtisserie. C'est ma passion. Je souhaite partager mes connaissances." rows="5" cols="33" onChange={(e) =>{handleChange(e)}} ></textarea>
          {errorDescription !== null && <p className="error">{errorDescription}</p>}

          <fieldset className="location">
            <legend>Lieu de rendez-vous</legend>
            {errorAddressNotFound !== null && <p className="error">{errorAddressNotFound}</p>}
            <label htmlFor="address">Adresse</label>
            <input type="text" name="address" onChange={(e) =>{handleChange(e)}} />
            {errorAddress !== null && <p className="error">{errorAddress}</p>}
            <label htmlFor="zip">Code postal</label>
            <input type="text" name="zip" onChange={(e) =>{handleChange(e)}} />
            {errorZip !== null && <p className="error">{errorZip}</p>}
            <label htmlFor="city">Ville</label>
            <input type="text" name="city" onChange={(e) =>{handleChange(e)}} />
            {errorCity !== null && <p className="error">{errorCity}</p>}
          </fieldset>

          <label htmlFor="duration">Durée de l'activité </label>
          <select name="duration" onChange={(e) =>{handleChange(e)}} >
            <option value="">Choisissez une durée</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 heure</option>
            <option value={90}>1 heure et 30 minutes</option>
            <option value={120}>2 heures</option>
            <option value={150}>2 heures et 30 minutes</option>
            <option value={180}>3 heures</option>
          </select>
          {errorDuration !== null && <p className="error">{errorDuration}</p>}

          <button onClick={(e) => {showWidget(e)}} >
            Ajouter une photo
          </button>
          {successPhoto === null && errorPhoto !== null && <p className="error">{errorPhoto}</p>}
          {successPhoto !== null && <p style={{color:"green"}}>{successPhoto}</p>}
          <button className="validate" type="submit">Valider</button>
        </form>
      }
    </section>
  )
}

export default AddActivity ;
