import { useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { saveOneBooking } from "../api/booking";

//on importe la state de basket de redux + son/ses actions
import { selectBasket, updateBasket, cleanBasket } from "../slices/basketSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "../slices/userSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'
import {faFaceSmileBeam} from '@fortawesome/free-regular-svg-icons'

import { Image, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from "../config"

const Basket = () => {
  const currentBasket = useSelector(selectBasket)
  const user = useSelector(selectUser)
  const [error, setError] = useState(null)
  const [redirect, setRedirect] = useState(null)
  const [newBookingId, setNewBookingId] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=>{
    setError(null)
  }, [])

  const removeActivityFromBasket = (oldBasket, activity) => {
    let newBasket = JSON.parse(JSON.stringify(oldBasket));
    dispatch(updateBasket(newBasket.filter(item => item.id !== activity.id)))
  }

  const deleteBasket = () => {
    dispatch(cleanBasket())
  }

  const validateOne = async(activity) => {
    // console.log("valide one -->", activity)
    let data = {
      "booker_id": user.data.id,
      "activity_id": activity.id,
      "activity_title": activity.title,
      "points": activity.points,
      "provider_id": activity.authorIsProvider ? activity.author_id : user.data.id,
      "beneficiary_id": activity.authorIsProvider ? user.data.id : activity.author_id
    }
    // console.log("data -->", data)
    await saveOneBooking(data)
    .then((res) => {
      if (res.status === 200){
        setNewBookingId(res.booking.insertId)
        removeActivityFromBasket(currentBasket.basket, activity)
        setRedirect(true)
      } else {
        let errorParagraph = document.querySelector(`#activity-${activity.id} p.error-booking`)
        errorParagraph.innerHTML = `${res.msg}`
        errorParagraph.style.display = "block"
      }
    })
    .catch((err) => console.log(err))
  }

  if (redirect && newBookingId !== null) {
    return <Navigate to={`/booking/${newBookingId}`}/>
  }

  return (
    <section className="basket">
      <h1>Mon panier</h1>
      { currentBasket.basket.length === 0 ?
      <div className="no-items">
        <p>Vous n'avez pas encore ajouté d'activités à votre panier ... n'attendez pas plus longtemps pour réserver! <FontAwesomeIcon icon={faFaceSmileBeam}/></p>
        <Link to="/activities">Découvrez les activités</Link>
      </div>

      :

      <div>
        { error !== null && <p style={{color:"indianred"}}>{error}</p>}
        <button aria-label="Supprimer tout le panier" onClick={()=>{deleteBasket()}}>Supprimer tout le panier</button>
        <ul className="basket-all-items">
            {currentBasket.basket.map((activity=>{
              return (
                <li  key={activity.id} className='basket-item' id={`activity-${activity.id}`} >
                    { activity.urlPicture !== null ?
                      <CloudinaryContext cloudName="dptcisxbs">
                          <Image publicId={activity.urlPicture} alt={`Image de l'activité ${activity.title}`}>
                            <Transformation quality="auto" fetchFormat="auto" />
                          </Image>
                      </CloudinaryContext> :
                      <img src={`${config.pict_url}/no-image.png`} alt="Pas d'image disponible"/>
                    }

                    <div className="basket-item-data">
                      <div>
                        <h3><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></h3>
                        <p className="basket-description-activity" >{activity.description.substring(0, 100)}...</p>
                        <p>{activity.authorIsProvider ? "Coût" : "Gain"} de l'activité: {activity.points} points</p>
                      </div>
                      <button aria-label="Je valide la réservation" onClick={()=>{validateOne(activity)}}>Je valide la réservation</button>
                    </div>

                    <p className='deleteItem'>
                      <FontAwesomeIcon icon={ faXmark} aria-label="Cliquer pour supprimer cette activité de votre panier"  onClick={()=>{removeActivityFromBasket(currentBasket.basket, activity)}}/>
                    </p>

                    <p className="error-booking"></p>
                </li>
              )
            }))
            }

        </ul>
      </div>



      }
    </section>
  )
}

export default Basket;
