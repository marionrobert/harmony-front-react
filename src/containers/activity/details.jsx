import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectBasket, updateBasket } from "../../slices/basketSlice";
import { selectUser} from "../../slices/userSlice"
import { setOnlineActivities } from "../../slices/activitySlice";

import { getOneActivity, updateOnlineOfflineStatus, getAllOnlineActivities } from "../../api/activity";
import { getOneUserById } from "../../api/user";
import { getAllCommentsByActivityId } from "../../api/comment";

import CommentCard from "../../components/comment-card";
import { config } from "../../config";
import {Link, Navigate} from "react-router-dom"

import { Image, Transformation, CloudinaryContext} from "cloudinary-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faArrowRotateLeft, faLocationDot, faCoins} from "@fortawesome/free-solid-svg-icons";
import { faFaceGrinWink, faClock, faPenToSquare } from "@fortawesome/free-regular-svg-icons";


const Details = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const [activity, setActivity] = useState(null)
  const [author, setAuthor] = useState(null)
  const [comments, setComments] = useState([])
  const currentBasket = useSelector(selectBasket)
  const user = useSelector(selectUser)
  const [msg, setMsg] = useState(null)
  const [msgBasket, setMsgBasket] = useState("")


  useEffect(() => {
    setMsg(null)
    setMsgBasket("")

    getOneActivity(params.id)
    .then((res)=>{
      if (res.status === 200){
        getOneUserById(res.activity.author_id)
        .then((response)=>{
          if (response.status === 200){
            setAuthor(response.user)
            setActivity(res.activity)
            getAllCommentsByActivityId(params.id)
            .then((answer)=>{
              if (answer.status === 200){
                setComments(answer.comments)
              }
            })
            .catch((mistake)=>console.log(mistake))
          }
        })
        .catch(error=>console.log(error))
      }
    })
    .catch((err)=>{
      console.log(err)
    })

  }, [params.id])

  const addToBasket = (e, oldBasket, newProduct) => {
    e.preventDefault()
    // console.log("addtobasket has been triggered", oldBasket, newProduct)
    let newBasket = JSON.parse(JSON.stringify(oldBasket));

    const index = newBasket.findIndex(product => product.id === newProduct.id)
    if ( index === - 1) {
      newProduct.quantityInCart = 1
      newBasket.push(newProduct)
    } else {
      setMsgBasket("Oups, cette activité est déjà dans votre panier!")
    }
    dispatch(updateBasket(newBasket))
  }

  const changeActivityStatus = (e) => {
    e.preventDefault()
    setMsg(null)
    const newStatus = (activity.status === "en ligne" ? "hors ligne" : "en ligne")
    updateOnlineOfflineStatus({status: newStatus}, params.id)
    .then((res) => {
      if (res.status === 200){
        getOneActivity(params.id)
        .then((answer) => {
          if (answer.status === 200){
            setActivity(answer.activity)
            getAllOnlineActivities()
            .then((answer)=>{
              if (answer.status === 200){
                dispatch(setOnlineActivities(answer.activities))
              }
            })
            .catch(mistake => console.log(mistake))
          }
        })
        .catch(error => console.log(error))
      } else {
        setMsg("Le statut n'a pas pu être mis à jour.")
      }
    })
    .catch(err => console.log(err))
  }

  if ( activity !== null && author !== null && user !== null) {

    if (author.id !== user.data.id && activity.status !== "en ligne"){
      return (<Navigate to={`/activities`} />)
    } else {
      return (
        <>
          <section className="activity-details">
            <Link to="/activities">Retour vers les activités <FontAwesomeIcon icon={faArrowRotateLeft}/></Link>

            <div className="activity-details-first-part">
              { activity.urlPicture !== null ?
                <CloudinaryContext cloudName="dptcisxbs">
                  <div>
                    <Image className="details-image" publicId={activity.urlPicture} alt={`Image de l'activité ${activity.title}`}>
                      <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                  </div>
                </CloudinaryContext>
                :
                <img className="details-image" src={`${config.pict_url}/no-image.png`} alt="Pas d'image disponible"/>
              }
            </div>

            <div className="activity-details-second-part">
              <h1>{activity.title}</h1>
              <p>{activity.description}</p>
              <p><FontAwesomeIcon icon={faLocationDot}/>  {activity.address}, {activity.zip} {activity.city}</p>
              { author !== null && <p>Annonce créée par: {author.firstName} {author.lastName.slice(0, 1).toUpperCase()}.</p> }
              { author !== null && author.avatar !== null ?
                <CloudinaryContext cloudName="dptcisxbs" className="details-activity-avatar">
                  <div>
                    <Image className="details-activity-avatar" publicId={author.avatar} alt={`Photo de l'utilisateur ${author.firstName} ${author.lastName}`}>
                      <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                  </div>
                </CloudinaryContext>
                :
                <img src={`${config.pict_url}/user.png`} className="details-activity-avatar" alt="Icône d'utilisateur"/>
              }
              <div>
                <p><FontAwesomeIcon icon={faClock}/> Durée : {activity.duration} minutes</p>
                <p><FontAwesomeIcon icon={faCoins}/> { activity.authorIsProvider === parseInt("1") ? "Coût" : "Gain"} : {activity.points} points</p>
              </div>
              { activity.status === "en ligne" && activity.author_id !== user.data.id &&
                <div className="zone-to-book" >
                  <button onClick={(e)=>{addToBasket(e, currentBasket.basket, activity)}}>
                    Je réserve !
                  </button>
                  <p style={{color: "indianred"}}>{msgBasket}</p>
                </div>
              }
            </div>


          { activity.status === "en ligne" && comments.length > 0 &&
            <article className="article-comments">
              <h2>Ils.Elles ont testé cette activité et témoignent!</h2>
              {comments.slice(-10).map(comment => {
                return <CommentCard key={comment.id} comment={comment} />
              })}
            </article>
          }

          { author.id === user.data.id &&
            <article className="author-zone">
              <p>Statut de l'annonce: {activity.status}</p>
              { (activity.status === "en ligne" || activity.status === "hors ligne") &&
              <div className="container">
                <p>Mettre mon annonce {activity.status === "en ligne" ? "hors ligne" : "en ligne"} : </p>
                <label className="switch" htmlFor="checkbox">
                  <input type="checkbox" id="checkbox" checked = {activity.status === "en ligne" ? true : false} onChange={(e) => {changeActivityStatus(e)}}/>
                  <div className="slider round"></div>
                </label>
                <p style={{color: "red"}}>{msg}</p>
              </div>
              }
              <Link to={`/activity/update/${activity.id}`}> <FontAwesomeIcon icon={faPenToSquare}/> Modifier mon annonce</Link>
            </article>
            }
          </section>
        </>
      )
    }
  } else {
    return(<>
      <p>Une erreur est survenue...</p>
      <Link to="/activities">Retour vers toutes les activités</Link>
    </>)
  }
}

export default Details;