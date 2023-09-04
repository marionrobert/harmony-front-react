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

  useEffect(() => {

  }, [])

  const removeActivityFromBasket = (oldBasket, activity) => {
    let newBasket = JSON.parse(JSON.stringify(oldBasket));
    dispatch(updateBasket(newBasket.filter(item => item.id !== activity.id)))
  }

  const deleteBasket = () => {
    dispatch(cleanBasket())
  }

  if (redirect) {
    return <Navigate to={`/profile`}/>
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
        <button className="first-validation" onClick={()=>{handleValidation()}}>Valider toute les réservations</button>
          {currentBasket.basket.map((activity=>{
            return (
              <li  key={activity.id} className='basket-item' >
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
                    <button className="validate-booking">Je valide la réservation</button>
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
