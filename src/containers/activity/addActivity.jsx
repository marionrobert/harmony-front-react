import { useEffect, useState } from "react"
import { Navigate} from "react-router-dom"
import { getAllCategories } from "../../api/category"
import { saveOneActivity, getCoords } from "../../api/activity"


const AddActivity = () => {
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
  const [errorForm, setErrorForm] = useState(null)
  // const token = window.localStorage.getItem('harmony-token')
  const [idNewActivity, setIdNewActivity] = useState(null)
  const [redirect, setRedirect] = useState(null)

  useEffect(() => {
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
    console.log("submit!")
    getCoords(address, city)
    .then((res) =>{
      if (res.features.length <= 0){
        setErrorForm("Nous n'avons pas trouvé l'adresse renseignée.")
      } else {
        let lat = res.features[0].geometry.coordinates[1]
        let lng = res.features[0].geometry.coordinates[0]

        let data = {
          "category_id": categoryId,
          "authorIsProvider": authorIsProvider,
          "title": title,
          "description": description,
          "address": address,
          "urlPicture": null,
          "city": city,
          "zip": zip,
          "lat": lat,
          "lng": lng,
          "duration": duration,
        }
        console.log(data)
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
      // case "photo":
      //   setPhoto(fileInput.current.files[0])
      //   break;
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

  if (redirect && idNewActivity !== null){
    return <Navigate to={`/activity/details/${idNewActivity}`} />
  }


  return (
    <>
      <h1>Créer une nouvelle activité</h1>
      {errorForm !== null && <p style={{color:"red"}}>{errorForm}</p>}
      { categories.length > 0 &&
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          <label htmlFor="category_id">Catégorie :</label>
          <select name="category_id">
            <option value="">Choisissez une catégorie</option>
            { categories.map(category=> {
              return (<option key={category.id} value={category.id}>{category.title} </option>)
            })}
          </select>

          <fieldset>
            <legend>Etes-vous fournisseur de l'activité ?</legend>
            <input type="radio" name="authorIsProvider" value={true} checked/>
            <label htmlFor="authorIsPorvider">Oui</label>
            <input type="radio" name="authorIsProvider" value={false}/>
            <label htmlFor="authorIsPorvider">Non</label>
          </fieldset>

          <label htmlFor="title">Titre</label>
          <input type="text" name="title" onChange={handleChange} required/>

          <label htmlFor="description">Description</label>
          <input type="text" name="description" onChange={handleChange} required/>

          <fieldset>
            <legend>Lieu de rendez-vous</legend>
            <label htmlFor="address">Adresse</label>
            <input type="text" name="address" onChange={handleChange} required/>
            <label htmlFor="zip">Code postal</label>
            <input type="text" name="zip" onChange={handleChange} required/>
            <label htmlFor="city">Ville</label>
            <input type="text" name="city" onChange={handleChange} required/>
          </fieldset>

          <label htmlFor="duration">Durée de l'activité : </label>
          <select name="duration">
            <option value="">Choisissez une durée</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 heure</option>
            <option value={90}>1 heure et 30 minutes</option>
            <option value={120}>2 heures</option>
            <option value={150}>2 heures et 30 minutes</option>
            <option value={180}>3 heures</option>
          </select>

          {/* <label htmlFor="urlPicture">Photo</label>
          <input type="text" name="urlPicture" onChange={handleChange} required/> */}

          <button type="submit">Valider</button>
        </form>
      }
    </>
  )
}

export default AddActivity ;
