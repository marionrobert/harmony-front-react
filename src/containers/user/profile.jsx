import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUser } from "../../slices/userSlice"
import { Link } from "react-router-dom"
import { config } from "../../config"
import { getAllActivitiesByAuthor } from "../../api/activity"
import { getAllCommentsByAuthorId } from '../../api/comment'
import { getAllBookingsByAuthorId, getAllBookingsByBookerId } from '../../api/booking'
import { updateAvatar, getOneUser } from '../../api/user'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";


const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [activities, setActivities] = useState([])
  const [comments, setComments] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [bookingsForMyActivities, setBookingsForMyActivities] = useState([])
  const [msgSuccess, setMsgSuccess] = useState(null)
  const [msgError, setMsgError] = useState(null)


  function tabsAnimation(e, tabContainerId){
    const tabs = [...document.querySelectorAll(`#${tabContainerId} .tab`)]
    const tabContents = [...document.querySelectorAll(`#${tabContainerId} .tab-content`)]

    let indexToRemove = tabs.findIndex(tab => tab.classList.contains("active-tab"))
    tabs[indexToRemove].setAttribute("aria-selected", "false")
    tabs[indexToRemove].setAttribute("tabindex", "-1")
    tabs[indexToRemove].classList.remove("active-tab");
    tabContents[indexToRemove].classList.remove("active-tab-content");

    const indexToShow = tabs.indexOf(e.target)
    tabs[indexToShow].setAttribute("tabindex", "0")
    tabs[indexToShow].setAttribute("aria-selected", "true")
    tabs[indexToShow].classList.add("active-tab")
    tabContents[indexToShow].classList.add("active-tab-content")
  }

  let tabFocus = 0

  function arrowNavigation(e, tabContainerId){
    const tabs = [...document.querySelectorAll(`#${tabContainerId} .tab`)]

    if(e.keyCode === 39 || e.keyCode === 37) {
      tabs[tabFocus].setAttribute("tabindex", -1)

      if(e.keyCode === 39) {
        tabFocus++;

        if(tabFocus >= tabs.length) {
          tabFocus = 0;
        }
      } else if (e.keyCode === 37) {
        tabFocus--;

        if(tabFocus < 0) {
          tabFocus = tabs.length -1;
        }
      }

      tabs[tabFocus].setAttribute("tabindex", 0)
      tabs[tabFocus].focus()
    }

  }

    //affichage interface de chargement d'images
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
        if (error) {
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
    if (resultEvent.event === "success") {
      updateAvatar({ "avatar": resultEvent.info.public_id }, user.data.key_id)
        .then((res) => {
          if (res.status === 200) {
            getOneUser(user.data.key_id)
              .then((response) => {
                if (response.status === 200) {
                  let myUser = response.user
                  myUser.token = user.data.token
                  dispatch(setUser(myUser))
                }
              })
              .catch((error) => { console.log(error) })
          } else {
            setMsgError("Echec de l'enregistrement de la photo")
          }
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    setMsgError(null)
    setMsgSuccess(null)

    getAllActivitiesByAuthor(user.data.id)
      .then((res) => {
        if (res.status === 200) {
          setActivities(res.activities)
        }
      })
      .catch((err) => {
        console.log("err from getAllActivitiesByAuthor -->", err)
      })

    getAllCommentsByAuthorId(user.data.id)
      .then((res) => {
        if (res.status === 200) {
          setComments(res.comments)
        }
      })
      .catch((err) => {
        console.log("err from getAllActivitiesByAuthor -->", err)
      })

    getAllBookingsByBookerId(user.data.id)
      .then((res) => {
        if (res.status === 200) {
          setMyBookings(res.bookings)
        }
      })
      .catch((err) => {
        console.log("err from getAllBookingsByBookerId -->", err)
      })


    getAllBookingsByAuthorId(user.data.id)
      .then((res) => {
        if (res.status === 200) {
          setBookingsForMyActivities(res.bookings)
        }
      })
      .catch((err) => {
        console.log("err from getAllBookingsByAuthorId -->", err)
      })

  }, [user.data.id])

  if (user !== null) {
    return (
      <>
        <Link to="/logout"><FontAwesomeIcon icon={faArrowRightFromBracket} /> Déconnexion</Link>
        <h1>Bienvenue {user.data.firstName}</h1>
        <section className='profile-user-data'>
          {user.data.avatar !== null ?
            <CloudinaryContext cloudName="dptcisxbs" className="profile-avatar">
              <div>
                <Image className="profile-avatar" publicId={user.data.avatar} alt={`Votre photo de profil`}>
                  <Transformation quality="auto" fetchFormat="auto" />
                </Image>
              </div>
            </CloudinaryContext>
            :
            <img src={`${config.pict_url}/user.png`} className="profile-avatar" alt="Icône d'utilisateur" />
          }
          <button onClick={(e) => { showWidget(e) }} >
            {user.data.avatar === null ? "Ajouter une " : "Modifier ma "}photo de profil
          </button>
          {msgSuccess === null && msgError !== null && <p style={{ color: "indianred" }}>{msgError}</p>}
          {msgSuccess !== null && <p style={{ color: "green" }}>{msgSuccess}</p>}
          <p>Mes points: {user.data.points}</p>
          <p>Mon numéro de téléphone: {user.data.phone}</p>
          <Link to="/profile/edit">Modifier mes informations</Link>
        </section>

        <section className='profile-user-activities'>
          <h2>Mes activités</h2>
          {activities.length > 0 ?
            <div className="tabs" id="tabs-1">
              <div
                className="tabs-btn-container"
                role="tablist"
                aria-label='tabs component'
              >

                <button
                  className="tab active-tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-1")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-1")}}
                  role="tab"
                  aria-controls="panel-1"
                  id="tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex={"0"}
                >
                  En ligne
                </button>

                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-1")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-1")}}
                  role="tab"
                  aria-controls="panel-2"
                  id="tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex={"-1"}
                >
                  Hors ligne
                </button>

                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-1")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-1")}}
                  role="tab"
                  aria-controls="panel-3"
                  id="tab-3"
                  type="button"
                  aria-selected="false"
                  tabIndex={"-1"}
                >
                  En attente de validation / Invalidée
                </button>

              </div>

              <div
                className="tab-content active-tab-content"
                id="panel-1"
                role="tabpanel"
                tabIndex={"0"}
                aria-labelledby='tab-1'
              >
                {activities.some(activity => activity.status === "en ligne") ? (
                  <ul>
                    {activities.map(activity => {
                      if (activity.status === "en ligne") {
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités en ligne.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-2"
                role="tabpanel"
                tabIndex={"0"}
                aria-labelledby='tab-2'
              >
                {activities.some(activity => activity.status === "hors ligne") ? (
                  <ul>
                    {activities.map(activity => {
                      if (activity.status === "hors ligne") {
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités hors ligne.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-3"
                role="tabpanel"
                tabIndex={"0"}
                aria-labelledby='tab-3'
              >
                {activities.some((activity) => (activity.status === "en attente de validation" || activity.status === "invalidé")) ? (
                  <ul>
                    {activities.map(activity => {
                      if (activity.status === "en attente de validation") {
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else if (activity.status === "invalidé") {
                        return (<li key={activity.id}><Link style={{ color: "indianred" }} to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités en attente de validation ou invalidée.</p>}
              </div>
            </div>
            : <p>Vous n'avez pas encore créé d'activités.</p>}
          <Link to="/activity/create"><FontAwesomeIcon icon={faSquarePlus} /> Créer une nouvelle activité</Link>
        </section>

        <section className='profile-user-comments'>
          <h2>Mes commentaires</h2>
          {comments.length > 0 ?
            <div className="tabs" id="tabs-2">
              <div
                className="tabs-btn-container"
                role="tablist"
                aria-label='tabs component'
              >
                <button
                  className="tab active-tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-2")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-2")}}
                  role="tab"
                  aria-controls="panel-1"
                  id="tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex="0"
                >
                  Validés
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-2")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-2")}}
                  role="tab"
                  aria-controls="panel-2"
                  id="tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                >
                  En attente de validation / invalidé
                  </button>
              </div>
              <div
                className="tab-content active-tab-content"
                id="panel-1"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-1"
              >
                {comments.some(comment => comment.status === "validé") ? (
                  <ul>
                    {comments.map(comment => {
                      if (comment.status === "validé") {
                        return (<li key={comment.id}><Link to={`/booking/${comment.booking_id}`}>{comment.title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas de commentaires validés.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-2"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-2"
              >
                {comments.some((comment) => (comment.status === "en attente de validation" || comment.status === "invalidé")) ? (
                  <ul>
                    {comments.map(comment => {
                      if (comment.status === "en attente de validation") {
                        return (<li key={comment.id}><Link to={`/booking/${comment.booking_id}`}>{comment.title}</Link></li>)
                      } else if (comment.status === "invalidé") {
                        return (<li key={comment.id}><Link style={{ color: "indianred" }} to={`/booking/${comment.booking_id}`}>{comment.title}</Link></li>)
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
          {myBookings.length > 0 ?
            <div className="tabs" id="tabs-3">
              <div
                className="tabs-btn-container"
                role="tablist"
                aria-label='tabs component'
              >
                <button
                  className="tab active-tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-3")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-3")}}
                  role="tab"
                  aria-controls="panel-1"
                  id="tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex="0"
                >
                  En attente de réalisation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-3")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-3")}}
                  role="tab"
                  aria-controls="panel-2"
                  id="tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                >
                  En attente d'acceptation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-3")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-3")}}
                  role="tab"
                  aria-controls="panel-3"
                  id="tab-3"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                >
                  Terminées
                </button>
              </div>
              <div
                className="tab-content active-tab-content"
                id="panel-1"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-1"
              >
                {myBookings.some(booking => booking.status === "en attente de réalisation") ? (
                  <ul>
                    {myBookings.map(booking => {
                      if (booking.status === "en attente de réalisation") {
                        return (<li key={booking.id}><Link to={`/booking/${booking.id}`}>Réservation n°{booking.id} - {booking.activity_title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations en attente de réalisation.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-2"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-2"
              >
                {myBookings.some(booking => booking.status === "en attente d'acceptation") ? (
                  <ul>
                    {myBookings.map(booking => {
                      if (booking.status === "en attente d'acceptation") {
                        return (<li key={booking.id}><Link to={`/booking/${booking.id}`}>Réservation n°{booking.id} - {booking.activity_title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas de réservations en attente d'acceptation.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-3"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-3"
              >
                {myBookings.some(booking => booking.status === "terminée") ? (
                  <ul>
                    {myBookings.map(booking => {
                      if (booking.status === "terminée") {
                        return (<li key={booking.id}><Link to={`/booking/${booking.id}`}>Réservation n°{booking.id} - {booking.activity_title}</Link></li>)
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
          {bookingsForMyActivities.length > 0 ?
            <div className="tabs" id="tabs-4">
              <div
                className="tabs-btn-container"
                role="tablist"
                aria-label='tabs component'
              >
                <button
                  className="tab active-tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-4")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-4")}}
                  role="tab"
                  aria-controls="panel-1"
                  id="tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex="0"
                >
                  En attente de réalisation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-4")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-4")}}
                  role="tab"
                  aria-controls="panel-2"
                  id="tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                >
                  En attente d'acceptation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-4")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-4")}}
                  role="tab"
                  aria-controls="panel-3"
                  id="tab-3"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                >
                  Terminées
                </button>
              </div>
              <div
                className="tab-content active-tab-content"
                id="panel-1"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-1"
              >
                {bookingsForMyActivities.some(booking => booking.status === "en attente de réalisation") ? (
                  <ul>
                    {bookingsForMyActivities.map(booking => {
                      if (booking.status === "en attente de réalisation") {
                        return (<li key={booking.id}><Link to={`/booking/${booking.id}`}>Réservation n°{booking.id} - {booking.activity_title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Il n'y a pas de réservations en attente de réalisation pour vos activités.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-2"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-2"
              >
                {bookingsForMyActivities.some(booking => booking.status === "en attente d'acceptation") ? (
                  <ul>
                    {bookingsForMyActivities.map(booking => {
                      if (booking.status === "en attente d'acceptation") {
                        return (<li key={booking.id}><Link to={`/booking/${booking.id}`}>Réservation n°{booking.id} - {booking.activity_title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Il n'y a pas de réservations en attente d'acceptation pour vos activités.</p>}
              </div>
              <div
                className="tab-content"
                id="panel-3"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tab-3"
              >
                {bookingsForMyActivities.some(booking => booking.status === "terminée") ? (
                  <ul>
                    {bookingsForMyActivities.map(booking => {
                      if (booking.status === "terminée") {
                        return (<li key={booking.id}><Link to={`/booking/${booking.id}`}>Réservation n°{booking.id} - {booking.activity_title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Il n'y a pas de réservations archivées pour vos activités.</p>}
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
