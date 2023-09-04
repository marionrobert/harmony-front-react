import { useSelector, useDispatch } from 'react-redux'
import {selectUser, setUser } from "../../slices/userSlice"
import {Link} from "react-router-dom"
import {config} from "../../config"
import { getAllActivitiesByAuthor } from "../../api/activity"
import { getAllCommentsByAuthorId } from '../../api/comment'
import { getAllBookingsByAuthorId, getAllBookingsByBookerId } from '../../api/booking'
import { updateAvatar, getOneUser } from '../../api/user'
import { useEffect, useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Image, Transformation, CloudinaryContext} from "cloudinary-react";


const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [activities, setActivities] = useState([])
  const [ comments, setComments] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [bookingsForMyActivities, setBookingsForMyActivities] = useState([])
  const [msgSuccess, setMsgSuccess] = useState(null)
  const [msgError, setMsgError] = useState(null)

  function tabsCommentsAnimation(e){
    const tabsComments = [...document.querySelectorAll(".tab-comments")]
    const tabsCommentsContents = [...document.querySelectorAll(".tab-comments-content")]

    const indexToRemove = tabsComments.findIndex(tab => tab.classList.contains("active-tab-comments"));
    tabsComments[indexToRemove].classList.remove("active-tab-comments");

    const indexToShow = tabsComments.indexOf(e.target)
    tabsComments[indexToShow].classList.add("active-tab-comments");

    tabsCommentsContents[indexToRemove].classList.remove("active-tab-comments-content");
    tabsCommentsContents[indexToShow].classList.add("active-tab-comments-content");
  }

  function tabsActivitiesAnimation(e){
    const tabsActivities = [...document.querySelectorAll(".tab-activities")]
    const tabsActivitiesContents = [...document.querySelectorAll(".tab-activities-content")]

    const indexToRemove = tabsActivities.findIndex(tab => tab.classList.contains("active-tab-activities"));
    tabsActivities[indexToRemove].classList.remove("active-tab-activities");

    const indexToShow = tabsActivities.indexOf(e.target)
    tabsActivities[indexToShow].classList.add("active-tab-activities");

    tabsActivitiesContents[indexToRemove].classList.remove("active-tab-activities-content");
    tabsActivitiesContents[indexToShow].classList.add("active-tab-activities-content");
  }

  function tabsMyBookingsAnimation(e){
    const tabsMyBookings = [...document.querySelectorAll(".tab-my-bookings")]
    const tabsMyBookingsContents = [...document.querySelectorAll(".tab-my-bookings-content")]

    const indexToRemove = tabsMyBookings.findIndex(tab => tab.classList.contains("active-tab-my-bookings"));
    tabsMyBookings[indexToRemove].classList.remove("active-tab-my-bookings");

    const indexToShow = tabsMyBookings.indexOf(e.target)
    tabsMyBookings[indexToShow].classList.add("active-tab-my-bookings");

    tabsMyBookingsContents[indexToRemove].classList.remove("active-tab-my-bookings-content");
    tabsMyBookingsContents[indexToShow].classList.add("active-tab-my-bookings-content");
  }

  function tabsBookingsAboutMyActivitiesAnimation(e){
    const tabsMyBookings = [...document.querySelectorAll(".tab-bookings-for-my-activities")]
    const tabsMyBookingsContents = [...document.querySelectorAll(".tab-bookings-for-my-activities-content")]

    const indexToRemove = tabsMyBookings.findIndex(tab => tab.classList.contains("active-tab-bookings-for-my-activities"));
    tabsMyBookings[indexToRemove].classList.remove("active-tab-bookings-for-my-activities");

    const indexToShow = tabsMyBookings.indexOf(e.target)
    tabsMyBookings[indexToShow].classList.add("active-tab-bookings-for-my-activities");

    tabsMyBookingsContents[indexToRemove].classList.remove("active-tab-bookings-for-my-activities-content");
    tabsMyBookingsContents[indexToShow].classList.add("active-tab-bookings-for-my-activities-content");
  }

  //fonction d'affichage de notre interface de chargement d'images/videos de cloudinary
  const showWidget = (e) => {
    e.preventDefault()
    //paramètrage de l'interface
    let widget = window.cloudinary.createUploadWidget(
        {
            cloudName: "dptcisxbs", //nom du repository cloud
            uploadPreset: "harmonyUsersCloudinary", //on branche au preset qui va envoyer vers le dossier saas
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
    if (resultEvent.event === "success"){
      updateAvatar({"avatar": resultEvent.info.public_id}, user.data.key_id)
      .then((res)=> {
        if (res.status === 200){
          getOneUser(user.data.key_id)
          .then((response)=>{
            if (response.status === 200){
              let myUser = response.user
              myUser.token = user.data.token
              dispatch(setUser(myUser))
            }
          })
          .catch((error)=>{ console.log(error)})
        } else {
          setMsgError("Echec de l'enregistrement de la photo")
        }
      })
      .catch(err => console.log(err))
    }
  }

  useEffect(()=> {
    setMsgError(null)
    setMsgSuccess(null)

    getAllActivitiesByAuthor(user.data.id)
    .then((res)=>{
      if (res.status === 200){
        setActivities(res.activities)
      }
    })
    .catch((err)=>{
      console.log("err from getAllActivitiesByAuthor -->", err)
    })

    getAllCommentsByAuthorId(user.data.id)
    .then((res)=>{
      if (res.status === 200){
        setComments(res.comments)
      }
    })
    .catch((err)=>{
      console.log("err from getAllActivitiesByAuthor -->", err)
    })

    getAllBookingsByBookerId(user.data.id)
    .then((res)=>{
      if (res.status === 200){
        setMyBookings(res.bookings)
      }
    })
    .catch((err)=>{
      console.log("err from getAllBookingsByBookerId -->", err)
    })


    getAllBookingsByAuthorId(user.data.id)
    .then((res)=>{
      if (res.status === 200){
        setBookingsForMyActivities(res.bookings)
      }
    })
    .catch((err)=>{
      console.log("err from getAllBookingsByAuthorId -->", err)
    })

  }, [user.data.id])

  if (user !== null){
    return (
      <>
        <Link to ="/logout"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Déconnexion</Link>
        <h1>Bienvenue {user.data.firstName}</h1>
        <section className='profile-user-data'>
          <h2>Mes informations personnelles</h2>
          { user.data.avatar !== null ?
            <CloudinaryContext cloudName="dptcisxbs" className="profile-avatar">
              <div>
                <Image className="profile-avatar" publicId={user.data.avatar} >
                  <Transformation quality="auto" fetchFormat="auto" />
                </Image>
              </div>
            </CloudinaryContext>
            :
            <img src={`${config.pict_url}/user.png`} className="profile-avatar"/>
          }
          <button onClick={(e) => {showWidget(e)}} >
            { user.data.avatar === null ? "Ajouter une " : "Modifier ma " }photo de profil
          </button>
          {msgSuccess === null && msgError !== null && <p style={{color:"red"}}>{msgError}</p>}
          {msgSuccess !== null && <p style={{color:"green"}}>{msgSuccess}</p>}



          <p>Mes points: {user.data.points}</p>
          <p>Mon numéro de téléphone: {user.data.phone}</p>
          <Link>Modifier mes informations</Link>
        </section>
        <section className='profile-user-activities'>
          <h2>Mes activités</h2>
          { activities.length > 0 ?
            <div className="tabs">
                <div className="tabs-activities">
                    <button className="tab-activities active-tab-activities" onClick={(e)=>{tabsActivitiesAnimation(e)}}>En ligne</button>
                    <button className="tab-activities" onClick={(e)=>{tabsActivitiesAnimation(e)}}>Hors ligne</button>
                    <button className="tab-activities" onClick={(e)=>{tabsActivitiesAnimation(e)}}>En attente de validation / Invalidée</button>
                </div>
                <div className="tab-activities-content active-tab-activities-content">
                { activities.some(activity => activity.status === "en ligne") ? (
                  <ul>
                    { activities.map(activity => {
                      if (activity.status === "en ligne"){
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités en ligne.</p>}
                </div>
                <div className="tab-activities-content">
                { activities.some(activity => activity.status === "hors ligne") ? (
                <ul>
                    { activities.map(activity => {
                      if (activity.status === "hors ligne"){
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités hors ligne.</p>}
                </div>
                <div className="tab-activities-content">
                { activities.some((activity) => (activity.status === "en attente de validation" || activity.status === "invalidé" )) ? (
                <ul>
                    { activities.map(activity => {
                      if (activity.status === "en attente de validation"){
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else if (activity.status === "invalidé") {
                        return (<li key={activity.id}><Link style={{color: "red"}} to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités en attente de validation ou invalidée.</p>}
                </div>
            </div>


           : <p>Vous n'avez pas encore créé d'activités.</p>}
           <Link to ="/activity/create"><FontAwesomeIcon icon={faSquarePlus}/> Créer une nouvelle activité</Link>
        </section>

        <section className='profile-user-comments'>
          <h2>Mes commentaires</h2>
          { comments.length > 0 ?
            <div className="tabs">
                <div className="tabs-comments">
                    <button className="tab-comments active-tab-comments" onClick={(e)=>{tabsCommentsAnimation(e)}}>Validés</button>
                    <button className="tab-comments" onClick={(e)=>{tabsCommentsAnimation(e)}}>En attente de validation / invalidé</button>
                </div>
                <div className="tab-comments-content active-tab-comments-content">
                { comments.some(comment => comment.status === "validé") ? (
                  <ul>
                    { comments.map(comment => {
                      if (comment.status === "validé"){
                        return (<li key={comment.id}>{comment.title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de commentaires validés.</p>}
                </div>
                <div className="tab-comments-content">
                { comments.some((comment) => (comment.status === "en attente de validation" || comment.status === "invalidé")) ? (
                <ul>
                    { comments.map(comment => {
                      if (comment.status === "en attente de validation"){
                        return (<li key={comment.id}>{comment.title}</li>)
                      } else if (comment.status === "invalidé") {
                        return (<li key={comment.id}>{comment.title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de commentaires en attente de validation ou invalidé.</p>}
                </div>
            </div>
          : <div className="no-comments">
            <p>Vous n'avez pas encore écrit de commentaires.</p>
          </div>}
        </section>

        <section className='profile-user-bookings'>
          <h2>Mes réservations</h2>
          { myBookings.length > 0 ?
            <div className="tabs">
                <div className="tabs-my-bookings">
                    <button className="tab-my-bookings active-tab-my-bookings" onClick={(e)=>{tabsMyBookingsAnimation(e)}}>En attente de réalisation</button>
                    <button className="tab-my-bookings" onClick={(e)=>{tabsMyBookingsAnimation(e)}}>En attente d'acceptation</button>
                    <button className="tab-my-bookings" onClick={(e)=>{tabsMyBookingsAnimation(e)}}>Terminées</button>
                </div>
                <div className="tab-my-bookings-content active-tab-my-bookings-content">
                { myBookings.some(booking => booking.status === "en attente de réalisation") ? (
                  <ul>
                    { myBookings.map(booking => {
                      if (booking.status === "en attente de réalisation"){
                        return (<li key={booking.id}>Réservation n°{booking.id} - {booking.activity_title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations en attente de réalisation.</p>}
                </div>
                <div className="tab-my-bookings-content">
                { myBookings.some(booking => booking.status === "en attente d'acceptation") ? (
                  <ul>
                    { myBookings.map(booking => {
                      if (booking.status === "en attente d'acceptation"){
                        return (<li key={booking.id}>Réservation n°{booking.id} - {booking.activity_title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations en attente d'acceptation.</p>}
                </div>
                <div className="tab-my-bookings-content">
                { myBookings.some(booking => booking.status === "terminée") ? (
                <ul>
                    { myBookings.map(booking => {
                      if (booking.status === "terminée"){
                        return (<li key={booking.id}>Réservation n°{booking.id} - {booking.activity_title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations archivées.</p>}
                </div>
            </div>
          : <div className="no-my-bookings">
            <p>Vous n'avez pas encore fait de réservations.</p>
          </div>}
        </section>

        <section className='profile-user-bookings-for-my-activities'>
          <h2>Les réservations sur mes activités</h2>
          { bookingsForMyActivities.length > 0 ?
            <div className="tabs">
                <div className="tabs-bookings-for-my-activities">
                    <button className="tab-bookings-for-my-activities active-tab-bookings-for-my-activities" onClick={(e)=>{tabsBookingsAboutMyActivitiesAnimation(e)}}>En attente de réalisation</button>
                    <button className="tab-bookings-for-my-activities" onClick={(e)=>{tabsBookingsAboutMyActivitiesAnimation(e)}}>En attente d'acceptation</button>
                    <button className="tab-bookings-for-my-activities" onClick={(e)=>{tabsBookingsAboutMyActivitiesAnimation(e)}}>Terminées</button>
                </div>
                <div className="tab-bookings-for-my-activities-content active-tab-bookings-for-my-activities-content">
                { bookingsForMyActivities.some(booking => booking.status === "en attente de réalisation") ? (
                  <ul>
                    { bookingsForMyActivities.map(booking => {
                      if (booking.status === "en attente de réalisation"){
                         return (<li key={booking.id}>Réservation n°{booking.id} - {booking.activity_title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations en attente de réalisation concernant vos activités.</p>}
                </div>
                <div className="tab-bookings-for-my-activities-content">
                { bookingsForMyActivities.some(booking => booking.status === "en attente d'acceptation") ? (
                <ul>
                    { bookingsForMyActivities.map(booking => {
                      if (booking.status === "en attente d'acceptation"){
                         return (<li key={booking.id}>Réservation n°{booking.id} - {booking.activity_title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations en attente d'acceptation concernant vos activités.</p>}
                </div>
                <div className="tab-bookings-for-my-activities-content">
                { bookingsForMyActivities.some(booking => booking.status === "terminée") ? (
                <ul>
                    { bookingsForMyActivities.map(booking => {
                      if (booking.status === "terminée"){
                         return (<li key={booking.id}>Réservation n°{booking.id} - {booking.activity_title}</li>)
                      } else {
                        return null
                      }
                      })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations archivées concernant vos activités.</p>}
                </div>
            </div>
          : <div className="no-bookings-for-my-activities">
            <p>Vos activités n'ont pas encore été réservées.</p>
          </div>}
        </section>
      </>
    )
  }
}

export default Profile;
