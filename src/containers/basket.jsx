import { useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { saveOneBooking } from "../api/booking";

//on importe la state de basket de redux + son/ses actions
import { selectBasket, updateBasket, cleanBasket } from "../slices/basketSlice"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "../slices/userSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPlus, faMinus, faXmark, faSquarePlus, faSquareMinus} from '@fortawesome/free-solid-svg-icons'

import { Image, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from "../config"

const Basket = () => {
  const currentBasket = useSelector(selectBasket)
  const user = useSelector(selectUser)
  const [error, setError] = useState(null)
  const [redirect, setRedirect] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [nbItems, setNbItems] = useState(0)
  const dispatch = useDispatch()
  const [newBookingId, setNewBookingId] = useState(null)


  useEffect(() => {

  }, [])

  const removeActivityFromBasket = (oldBasket, activity) => {
    let newBasket = JSON.parse(JSON.stringify(oldBasket));
    dispatch(updateBasket(newBasket.filter(item => item.id !== activity.id)))
  }

  const deleteBasket = () => {
    dispatch(cleanBasket())
  }

  const validateAll = () => {
    console.log("veut tout valider d'un coup, on valide un par un !")
    console.log("on commence par valider toutes les activités où on est provider")
  }

  const validateOne = (activity) => {
    // console.log("valide one -->", activity)
    let data = {
      "booker_id": user.data.id,
      "activity_id": activity.id,
      "activity_title": activity.title,
      "points": activity.points,
      "provider_id": activity.authorIsProvider ? activity.author_id : user.data.id,
      "beneficiary_id": activity.authorIsProvider ? user.data.id : activity.author_id
    }
    console.log("data -->", data)
    saveOneBooking(data)
    .then((res) => {
      if (res.status === 200){
        setNewBookingId(res.insertId)
        setRedirect(true)
        // à voir plus tard
        // let activityCard = document.querySelector(`#activity-${activity.id}`)
        // activityCard.style.filter = "blur(1px)"
      } else {
        setError(`Echec: ${res.msg}`)
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
      <div>
        <p>Vous n'avez pas encore ajouté d'articles à votre panier ... n'attendez plus!</p>
        <button><Link to="/activities">Découvrez les activités</Link></button>
      </div>

      :

      <ul className="basket-all-items">
        { error !== null && <p style={{color:"red"}}>{error}</p>}
        <button onClick={()=>{deleteBasket()}}>Supprimer tout le panier</button>
          {currentBasket.basket.map((activity=>{
            return (
              <li  key={activity.id} className='basket-item' id={`activity-${activity.id}`} >
                  { activity.urlPicture !== null ?
                    <CloudinaryContext cloudName="dptcisxbs">
                        <Image publicId={activity.urlPicture}>
                          <Transformation quality="auto" fetchFormat="auto" />
                        </Image>
                    </CloudinaryContext> :
                    <img src={`${config.pict_url}/no-image.png`}/>
                  }

                  <div className="basket-item-data">
                    <div>
                      <h3>{activity.title}</h3>
                      {/* <p >{activity.description.substring(0, 50)}...</p> */}
                      <p>{activity.authorIsProvider ? "Coût" : "Gain"} : {activity.points} points</p>
                    </div>
                    <button onClick={()=>{validateOne(activity)}}>Je valide la réservation</button>
                  </div>

                  <p className='deleteItem'>
                    <FontAwesomeIcon icon={ faXmark}  onClick={()=>{removeActivityFromBasket(currentBasket.basket, activity)}}/>
                  </p>
              </li>
            )
          }))
          }

        </ul>



      }
    </section>
  )
}

export default Basket;
