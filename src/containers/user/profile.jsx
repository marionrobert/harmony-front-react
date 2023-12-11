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
import { faArrowRightFromBracket, faSquarePlus, faMobile, faPhone, faCamera} from "@fortawesome/free-solid-svg-icons";
import {faPenToSquare } from "@fortawesome/free-regular-svg-icons";
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
    //récupération de tous les éléments tab (boutons) dans le contenant concerné (tabContainerId)
    const tabs = [...document.querySelectorAll(`#${tabContainerId} .tab`)]
    //récupération de tous les éléments tab-content (contneu, panneau à afficher) dans le contenant concerné (tabContainerId)
    const tabContents = [...document.querySelectorAll(`#${tabContainerId} .tab-content`)]

    // le bouton et le contneu précédemment "actifs/affichés" sont désactivés
    // récupération de l'index du tab actuel actif
    let indexToRemove = tabs.findIndex(tab => tab.classList.contains("active-tab"))
    //accessibilité: on indique que l'onglet actuel n'est plus sélectionné
    tabs[indexToRemove].setAttribute("aria-selected", "false")
    // acessibilité: l'onglet ne doit plus recevoir le focus par le navigateur
    tabs[indexToRemove].setAttribute("tabindex", "-1")
    // l'onglet actuel et son contenu lié ne doivent plus être affichés
    tabs[indexToRemove].classList.remove("active-tab");
    tabContents[indexToRemove].classList.remove("active-tab-content");

    // le bouton et son contenu nouvellement sélectionnés doivent être affichés
    // récupération de l'index du tab concerné, qui doit devenir actif
    const indexToShow = tabs.indexOf(e.target)
    //accessibilité: on indique que le nouvel onglet est sélectionné
    tabs[indexToShow].setAttribute("tabindex", "0")
    // acessibilité: le nouvel onglet reçoit le focus du navigateur
    tabs[indexToShow].setAttribute("aria-selected", "true")
    // le nouvel onglet et son contenu sont affichés
    tabs[indexToShow].classList.add("active-tab")
    tabContents[indexToShow].classList.add("active-tab-content")
  }

 // au chargement/par défaut, le focus est sur l'onglet/bouton/tag 0
  let tabFocus = 0

  // création d'une navigation avec les flèches gauche/droite du clavier
  function arrowNavigation(e, tabContainerId){
    // récupération des onglets/boutons existant dans le contenant (tabContainerId)
    const tabs = [...document.querySelectorAll(`#${tabContainerId} .tab`)]

    // la touche enfoncée est la flèche droite ou gauche
    if(e.keyCode === 39 || e.keyCode === 37) {
      // on retire le focus de l'onglet précédemment sélectionné
      tabs[tabFocus].setAttribute("tabindex", -1)

      // l'utilisateur va à droite
      if(e.keyCode === 39) {
        // on incrémente de 1 le tabFocus
        tabFocus++;

        // si on est tout à droite
        if(tabFocus >= tabs.length) {
          //on retourne tout à gauche
          tabFocus = 0;
        }
      } else if (e.keyCode === 37) { // l'utilisateur va à gauche
       // on désincrémente de 1 l'index
        tabFocus--;

        // si on est tout à gauche
        if(tabFocus < 0) {
          // on retourne tout à droite
          tabFocus = tabs.length -1;
        }
      }

      // on attribue le tabindex au nouvel onglet
      tabs[tabFocus].setAttribute("tabindex", 0)
      // et on lui donne le focus
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
      <section className='profile'>
        <div className="logout-link">
          <Link to ="/logout"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Déconnexion</Link>
        </div>
        <h1>Bienvenue {user.data.firstName}</h1>
        <div className='avatar-zone'>
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
        </div>
        <article className='profile-user-data'>
          <h6>Mes points : {user.data.points}</h6>
          <p><FontAwesomeIcon icon={faMobile}/> <FontAwesomeIcon icon={faPhone}/> : {user.data.phone}</p>
          <div className='user-actions'>
            <span><Link  onClick={(e) => { showWidget(e) }}><FontAwesomeIcon icon={faCamera}/> {user.data.avatar === null ? "Ajouter une " : "Modifier ma "}photo</Link></span>
            <span><Link to="/profile/edit"><FontAwesomeIcon icon={faPenToSquare}/> Modifier mes informations</Link></span>
            <span><Link to="/activity/create"><FontAwesomeIcon icon={faSquarePlus} /> Créer une activité</Link></span>
          </div>
          {msgSuccess === null && msgError !== null && <p style={{ color: "red", fontWeight: "bold" }}>{msgError}</p>}
          {msgSuccess !== null && <p style={{ color: "green" }}>{msgSuccess}</p>}
        </article>

        <article >
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
                  aria-controls="tabs-1-panel-1"
                  id="tabs-1-tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex={"0"}
                  aria-label="Cliquer pour voir vos activités en ligne"
                >
                  En ligne
                </button>

                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-1")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-1")}}
                  role="tab"
                  aria-controls="tabs-1-panel-2"
                  id="tabs-1-tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex={"-1"}
                  aria-label="Cliquer pour voir vos activités hors ligne"
                >
                  Hors ligne
                </button>

                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-1")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-1")}}
                  role="tab"
                  aria-controls="tabs-1-panel-3"
                  id="tabs-1-tab-3"
                  type="button"
                  aria-selected="false"
                  tabIndex={"-1"}
                  aria-label="Cliquer pour voir vos activités en attente de validation"
                >
                  En attente de validation
                </button>

              </div>

              <div
                className="tab-content active-tab-content"
                id="tabs-1-panel-1"
                role="tabpanel"
                tabIndex={"0"}
                aria-labelledby='tabs-1-tab-1'
              >
                {activities.some(activity => activity.status === "online") ? (
                  <ul>
                    {activities.map(activity => {
                      if (activity.status === "online") {
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
                id="tabs-1-panel-2"
                role="tabpanel"
                tabIndex={"0"}
                aria-labelledby='tabs-1-tab-2'
              >
                {activities.some(activity => activity.status === "offline") ? (
                  <ul>
                    {activities.map(activity => {
                      if (activity.status === "offline") {
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
                id="tabs-1-panel-3"
                role="tabpanel"
                tabIndex={"0"}
                aria-labelledby='tabs-1-tab-3'
              >
                {activities.some((activity) => (activity.status === "waiting_for_validation" || activity.status === "invalidated")) ? (
                  <ul>
                    {activities.map(activity => {
                      if (activity.status === "waiting_for_validation") {
                        return (<li key={activity.id}><Link to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else if (activity.status === "invalidated") {
                        return (<li key={activity.id}><Link style={{ color: "red", fontWeight: "bold" }} to={`/activity/details/${activity.id}`}>{activity.title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas d'activités en attente de validation ou invalidée.</p>}
              </div>
            </div>
            : <p>Vous n'avez pas encore créé d'activités.</p>}
        </article>

        <article >
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
                  aria-controls="tabs-2-panel-1"
                  id="tabs-2-tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex="0"
                  aria-label="Cliquer pour voir vos commentaires validés"
                >
                  Validés
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-2")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-2")}}
                  role="tab"
                  aria-controls="tabs-2-panel-2"
                  id="tabs-2-tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                  aria-label="Cliquer pour voir vos commentaires en attente de validation"
                >
                  En attente de validation
                  </button>
              </div>
              <div
                className="tab-content active-tab-content"
                id="tabs-2-panel-1"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-2-tab-1"
              >
                {comments.some(comment => comment.status === "validated") ? (
                  <ul>
                    {comments.map(comment => {
                      if (comment.status === "validated") {
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
                id="tabs-2-panel-2"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-2-tab-2"
              >
                {comments.some((comment) => (comment.status === "waiting_for_validation" || comment.status === "invalidated")) ? (
                  <ul>
                    {comments.map(comment => {
                      if (comment.status === "waiting_for_validation") {
                        return (<li key={comment.id}><Link to={`/booking/${comment.booking_id}`}>{comment.title}</Link></li>)
                      } else if (comment.status === "invalidated") {
                        return (<li key={comment.id}><Link style={{color: "red", fontWeight: "bold"}} to={`/booking/${comment.booking_id}`}>{comment.title}</Link></li>)
                      } else {
                        return null
                      }
                    })
                    }
                  </ul>) : <p>Vous n'avez pas de commentaires en attente de validation ou invalidé.</p>}
              </div>
            </div>
            : <div className="no-comments">
              <p>Vous n'avez pas encore laissé de commentaires.</p>
            </div>}
        </article>

        <article >
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
                  aria-controls="tabs-3-panel-1"
                  id="tabs-3-tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex="0"
                  aria-label="Cliquer pour voir vos réservations en attente de réalisation"
                >
                  En attente de réalisation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-3")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-3")}}
                  role="tab"
                  aria-controls="tabs-3-panel-2"
                  id="tabs-3-tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                  aria-label="Cliquer pour voir vos réservations en attente d'acceptation"
                >
                  En attente d'acceptation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-3")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-3")}}
                  role="tab"
                  aria-controls="tabs-3-panel-3"
                  id="tabs-3-tab-3"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                  aria-label="Cliquer pour voir vos réservations terminées"
                >
                  Terminées
                </button>
              </div>
              <div
                className="tab-content active-tab-content"
                id="tabs-3-panel-1"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-3-tab-1"
              >
                {myBookings.some(booking => booking.status === "waiting_for_completion") ? (
                  <ul>
                    {myBookings.map(booking => {
                      if (booking.status === "waiting_for_completion") {
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
                id="tabs-3-panel-2"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-3-tab-2"
              >
                {myBookings.some(booking => booking.status === "waiting_for_acceptance") ? (
                  <ul>
                    {myBookings.map(booking => {
                      if (booking.status === "waiting_for_acceptance") {
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
                id="tabs-3-panel-3"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-3-tab-3"
              >
                {myBookings.some(booking => booking.status === "finished") ? (
                  <ul>
                    {myBookings.map(booking => {
                      if (booking.status === "finished") {
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
        </article>

        <article>
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
                  aria-controls="tabs-4-panel-1"
                  id="tabs-4-tab-1"
                  type="button"
                  aria-selected="true"
                  tabIndex="0"
                  aria-label="Cliquer pour voir les réservations sur vos activités en attente de réalisation"
                >
                  En attente de réalisation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-4")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-4")}}
                  role="tab"
                  aria-controls="tabs-4-panel-2"
                  id="tabs-4-tab-2"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                  aria-label="Cliquer pour voir les réservations sur vos activités en attente d'acceptation"
                >
                  En attente d'acceptation
                </button>
                <button
                  className="tab"
                  onClick={(e)=>{tabsAnimation(e, "tabs-4")}}
                  onKeyDown={(e)=>{arrowNavigation(e, "tabs-4")}}
                  role="tab"
                  aria-controls="tabs-4-panel-3"
                  id="tabs-4-tab-3"
                  type="button"
                  aria-selected="false"
                  tabIndex="-1"
                  aria-label="Cliquer pour voir les réservations sur vos activités terminées"
                >
                  Terminées
                </button>
              </div>
              <div
                className="tab-content active-tab-content"
                id="tabs-4-panel-1"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-4-tab-1"
              >
                {bookingsForMyActivities.some(booking => booking.status === "waiting_for_completion") ? (
                  <ul>
                    {bookingsForMyActivities.map(booking => {
                      if (booking.status === "waiting_for_completion") {
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
                id="tabs-4-panel-2"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-4-tab-2"
              >
                {bookingsForMyActivities.some(booking => booking.status === "waiting_for_acceptance") ? (
                  <ul>
                    {bookingsForMyActivities.map(booking => {
                      if (booking.status === "waiting_for_acceptance") {
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
                id="tabs-4-panel-3"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="tabs-4-tab-3"
              >
                {bookingsForMyActivities.some(booking => booking.status === "finished") ? (
                  <ul>
                    {bookingsForMyActivities.map(booking => {
                      if (booking.status === "finished") {
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
        </article>
      </section>
    )
  }
}

export default Profile;
