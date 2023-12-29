import { useSelector } from "react-redux";
import { selectActivities } from "../slices/activitySlice";
import ActivityCard from "../components/activity-card"
import { useEffect, useState } from "react";
import { getAllCategories } from "../api/category";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";


const Activities = () => {
  const activities = useSelector(selectActivities)
  const [categories, setCategories] = useState([])
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [agreeForLocation, setAgreeForLocation] = useState(false);
  const [rangeHours, setRangeHours] = useState([1, 2]);

  useEffect(() => {
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


  return (
    <>
      {/* {console.log(agreeForLocation, latitude, longitude)} */}
      { activities.activities.length > 0 &&

        <section className="section-activities">

          <h1>Toutes les activités disponibles</h1>

          <form className="filter-activities">

            <label>Choisissez une catégorie: </label>
            {categories.length > 0 &&
            <select>
              {categories.map(category => {
              return <option key={category.id} value={category.title}>{category.title}</option>
              })}
            </select>
            }

            <fieldset>
              <legend>Vous souhaitez :</legend>
              <input type="radio"/>
              <label htmlFor="authorIsProvider" value={false}>donner un coup de main</label>
              <input type="radio" id="authorIsProvider" name="authorIsProvider"/>
              <label htmlFor="authorIsProvider" value={true}>recevoir un coup de main</label>
            </fieldset>

            <label htmlFor="points">Nombre de points :</label>
            <input type="range" id="points" name="points" min="1" max="6" step="1"/>

            <p>Durée de l'activité</p>
            <span>{rangeHours[0]} h</span>
            <RangeSlider className="margin-lg" value={rangeHours} onInput={setRangeHours} min={0.5} max={3} step={0.5}/>
            <span>{rangeHours[1]} h</span>


          </form>





          {activities.activities.map(activity => {
            return <ActivityCard key={activity.id} activity={activity} />
          })}
        </section>
      }
    </>
  )
}

export default Activities;
