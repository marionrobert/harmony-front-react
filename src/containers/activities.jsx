import { useSelector } from "react-redux";
import { selectActivities } from "../slices/activitySlice";
import ActivityCard from "../components/activity-card"
import { useEffect, useState } from "react";
import { getAllCategories } from "../api/category";
import { getAllActivitiesWithFilters } from "../api/activity";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'


const Activities = () => {
  const activities = useSelector(selectActivities)
  const [categories, setCategories] = useState([])
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [agreeForLocation, setAgreeForLocation] = useState(false);
  const [authorIsProvider, setAuthorIsProvider] = useState(false)
  const [rangeHours, setRangeHours] = useState([1, 2]);
  const [distance, setDistance] = useState(10)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [resultMessage, setResultMessage] = useState(null)
  const [filteredActivities, setFilteredActivities] = useState([])

  useEffect(() => {
    setResultMessage(null)
    getAllCategories()
    .then((res)=>{
      if (res.status === 200){
        setCategories(res.categories)
      }
    })
    .catch(error => console.log(error))


     // Vérifie si le navigateur prend en charge la géolocalisation
     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        setAgreeForLocation(true)
        // console.log(position)
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      }, (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error('booouh L\'accès à la géolocalisation a été refusé par l\'utilisateur.');
          setAgreeForLocation(false)// Gérer le cas où l'accès à la géolocalisation est refusé par l'utilisateur
        } else {
          console.error('Erreur de géolocalisation : ', error);
        }
      });
    } else {
      console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
    }
  }, [])

  const handleChange = (e) => {
    switch (e.currentTarget.name) {
      case "distance":
        setDistance(e.currentTarget.value)
        break;
      case "authorIsProvider":
        setAuthorIsProvider(e.currentTarget.value)
        break;
    }
  }

  const handleChangeCheckedBox = (e) => {
    const { value, checked } = e.target;
    console.log(value)
    // Si la case est cochée, ajouter la valeur à la liste des catégories sélectionnées
    // Sinon, retirer la valeur de la liste
    if (checked) {
      setSelectedCategories([...selectedCategories, parseInt(value)]);
    } else {
      setSelectedCategories(selectedCategories.filter(category => category !== parseInt(value)));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultMessage(null)
    let data = {
      "categories": selectedCategories,
      "duration": {
          "min_duration": rangeHours[0]*60,
          "max_duration": rangeHours[1]*60
      },
      "distance": distance,
      "lat": "48.68333",
      "lng": "2.38333",
      "authorIsProvider": authorIsProvider
    }
    // console.log(data)

    getAllActivitiesWithFilters(data)
    .then((res)=>{
      // console.log(res)
      if (res.status === 200) {
        setResultMessage(res.msg)
        setFilteredActivities(res.activities)
      } else if (res.status === 204){
        setResultMessage(res.msg)
      } else {
        setResultMessage("Une erreur est survenue. Veuillez réessayer plus tard.")
      }
    })
    .catch((err)=>{
      console.log(err)
      setResultMessage("Une erreur est survenue. Veuillez réessayer plus tard.")
    })

    hideFilters();
  }

  const avortSearch = (e) => {
    e.preventDefault()
    let allCheckedBoxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckedBoxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setFilteredActivities([])
    setResultMessage(null)
  }

  const hideFilters = () => {
    let form = document.querySelector("form.filter-activities")
    form.style.display="none";
  }

  const displayFilters = () => {
    let form = document.querySelector("form.filter-activities")
    form.style.display="block";
  }


  return (
    <>
      {/* {console.log(agreeForLocation, latitude, longitude)} */}
      { activities.activities.length > 0 &&

        <section className="all-activities">

          <h1>Toutes les activités disponibles</h1>

          <p onClick={(e) => {displayFilters()}}>{ filteredActivities.length > 0 ? "Modifier les filtres" : "Filtrer les annonces"}</p>

          <form className="filter-activities" onSubmit={(e) => {handleSubmit(e)}}>

          <FontAwesomeIcon icon={faXmark} aria-label="Fermer la fenêttre des filtres" onClick={(e)=> {hideFilters()}}/>

          {categories.length > 0 &&
            <div className="categories">
              <p>Catégories: </p>
              {categories.map(category => {
                return (
                  <span key={category.id} >
                    <input type="checkbox" value={category.id} onChange={(e)=>{handleChangeCheckedBox(e)}}/>
                    <label> {category.title}</label>
                  </span>

                  )
              })}
            </div>
          }

            <div className="author-is-provider">
              <p>Je veux :</p>
              <span>
                <input type="radio" id="authorIsProvider" name="authorIsProvider" onChange={(e)=>{handleChange(e)}} value={false}/>
                <label htmlFor="authorIsProvider" >donner un coup de main</label>
              </span>
              <span>
                <input type="radio" id="authorIsProvider" name="authorIsProvider" onChange={(e)=>{handleChange(e)}} value={true}/>
                <label htmlFor="authorIsProvider" >recevoir un coup de main</label>
              </span>
            </div>

            <div className="time">
              <p>Durée de l'activité :</p>
              <span>{rangeHours[0]} h</span>
              <RangeSlider className="margin-lg" value={rangeHours} onInput={setRangeHours} min={0.5} max={3} step={0.5}/>
              <span>{rangeHours[1]} h</span>
            </div>

            <div className="distance">
              <p>Dans un rayon de :</p>
              <input type="range" min="5" max="30" step="5" id="distance" name="distance" defaultValue={distance} onChange={(e)=>{handleChange(e)}}/>
              <span>{distance} km</span>
            </div>

            <div className="buttons">
              <button aria-label="Rechercher" className="button">Rechercher</button>
              <button aria-label="Supprimer les filtres" className="button" onClick={(e)=>{avortSearch(e)}}>Supprimer les filtres</button>
            </div>
          </form>



          {resultMessage !== null && <h3 className="result-message">{resultMessage}</h3>}

          { filteredActivities.length > 0 ?
            filteredActivities.map(activity => {
              return <ActivityCard key={activity.id} activity={activity} />
            })
          :
            activities.activities.map(activity => {
              return <ActivityCard key={activity.id} activity={activity} />
            })
          }
        </section>
      }
    </>
  )
}

export default Activities;
