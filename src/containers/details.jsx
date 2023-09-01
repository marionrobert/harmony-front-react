import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectBasket, updateBasket } from "../slices/basketSlice";
import { selectUser, setUser} from "../slices/userSlice"

import { getOneActivity } from "../api/activity";
import { getOneUserById } from "../api/user";
import { getAllCommentsByActivityId } from "../api/comment";

import CommentCard from "../components/comment-card";
import { config } from "../config";
import {Link, Navigate} from "react-router-dom"

import { Image, Transformation, CloudinaryContext} from "cloudinary-react";



const Details = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const [activity, setActivity] = useState(null)
  const [author, setAuthor] = useState(null)
  const [comments, setComments] = useState([])
  const currentBasket = useSelector(selectBasket)
  const user = useSelector(selectUser)

  useEffect(() => {
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
    console.log("addtobasket has been triggered", oldBasket, newProduct)

    let newBasket = JSON.parse(JSON.stringify(oldBasket));

    const index = newBasket.findIndex(product => product.id === newProduct.id)
    if ( index === - 1) {
      newProduct.quantityInCart = 1
      newBasket.push(newProduct)
    } else {
      newBasket[index].quantityInCart += 1
    }
    dispatch(updateBasket(newBasket))
  }

  if ( activity !== null && author !== null && user !== null) {

    if (author.id !== user.data.id && activity.status !== "en ligne"){
      return (<Navigate to={`/activities`} />)
    } else {
      return (
        <>
          <section className="activity-details">
            <p style={{color: "red"}}>Statut: {activity.status}</p>
            <Link to="/activities">Retour vers toutes les activités</Link>
            <hr></hr>
            <h1>{activity.title}</h1>
            <p>{activity.description}</p>
            { activity.urlPicture !== null ?
              <CloudinaryContext cloudName="dptcisxbs">
                <div>
                  <Image className="details-image" publicId={activity.urlPicture} id='profilImg' >
                    <Transformation quality="auto" fetchFormat="auto" />
                  </Image>
                </div>
              </CloudinaryContext>
              :
              <img className="details-image" src={`${config.pict_url}/no-image.png`} />
            }
            <p>Lieu de rendez-vous: {activity.address}, {activity.zip} {activity.city}</p>

            { author !== null && <p>Annonce créée par: {author.firstName} {author.lastName.slice(0, 1).toUpperCase()}.</p> }
            { author !== null && author.avatar !== null ? <img src={author.avatar} className="details-activity-avatar"/> : <img src={`${config.pict_url}/user.png`} className="details-activity-avatar"/> }
            <p>Durée de l'activité: {activity.duration} minutes</p>
            <p>Coût de l'activité: {activity.points} points</p>
          </section>

          { activity.status === "en ligne" &&
            <button onClick={(e)=>{addToBasket(e, currentBasket.basket, activity)}}>
              Je réserve !
            </button>
          }

          { activity.status === "en ligne" && comments.length > 0 &&
            <section className="section-comments">
              <h2>Ils ont déjà réservé cette activité, ils témoignent!</h2>
              {comments.slice(-10).map(comment => {
                return <CommentCard key={comment.id} comment={comment} />
              })}
            </section>
          }

          { author.id === user.data.id &&
            <section>
              <p>Je suis l'auteur je peux modifier mon annonce</p>
              <button>Modifier mon annonce</button>
            </section>
          }

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
