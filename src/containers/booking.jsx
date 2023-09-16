import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getOneBooking } from "../api/booking";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import {getOneUserById} from "../api/user"
import { acceptBooking, deleteOneBooking, validateAchievementByBeneficiary, validateAchievementByProvider } from "../api/booking";
import {saveOneComment, getOneCommentByBookingId, updateOneComment} from "../api/comment"
import CommentCard from "../components/comment-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMobile, faPhone, faCoins, faLocationDot, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";
import { config } from "../config"

const Booking = () => {
  const params = useParams()

  const [booking, setBooking] = useState(null)
  const [provider, setProvider] = useState(null)
  const [beneficiary, setBeneficiary] = useState(null)
  const user = useSelector(selectUser)
  const [redirect, setRedirect]  = useState(null)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [bookingStatus, setBookingStatus] = useState(null)
  const [beneficiaryValidation, setBeneficiaryValidation] = useState(null)
  const [providerValidation, setProviderValidation] = useState(null)

  const [comment, setComment] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [score, setScore] = useState("")
  const [errorForm, setErrorForm] = useState(null)
  const [msgForm, setMsgForm] = useState(null)



  useEffect(()=>{
    setMsgForm(null)
    setErrorForm(null)

    getOneBooking(parseInt(params.id))
    .then((res)=>{
      if (res.status === 200){
        setBooking(res.booking)
        setBookingStatus(res.booking.booking_status)
        setBeneficiaryValidation(res.booking.beneficiaryValidation)
        setProviderValidation(res.booking.providerValidation)

        getOneUserById(res.booking.provider_id)
        .then((response)=>{
          if (response.status === 200){
            setProvider(response.user)
          }
        })
        .catch(error => console.log(error))

        getOneUserById(res.booking.beneficiary_id)
        .then((answer)=>{
          if (answer.status === 200){
            setBeneficiary(answer.user)

          }
        })
        .catch(error => console.log(error))

        getOneCommentByBookingId(params.id)
        .then((response) => {
          if (response.status === 200){
            setComment(response.comment)
            setTitle(response.comment.title)
            setContent(response.comment.content)
            setScore(response.comment.score)
          }
        })
        .catch((error) => console.log(error))

      }
    })
    .catch(err => console.log(err))
  }, [params.id])


  const validateBooking = (e) => {
    e.preventDefault()
    let input = document.querySelector(`input#answer-yes`)
    input.checked = true;
    acceptBooking({"status": "en attente de réalisation"}, booking.booking_id)
    .then((res)=>{
      if (res.status === 200){
        setBooking(res.bookingUpdated)
        setBookingStatus("en attente de réalisation")
      } else {
        setErrorForm(res.msg)
      }
    })
    .catch(() => {setErrorForm("Une erreur est survenue")})
  }

  const declineBooking = (e) => {
    e.preventDefault()
    let input = document.querySelector(`input#answer-no`)
    input.checked = true;
    deleteOneBooking(booking.booking_id)
    .then((res)=>{
      if (res.status === 200){
        setRedirect(true)
      } else {
        setErrorForm(res.msg)
      }
    })
    .catch(() => {setErrorForm("Une erreur est survenue")})
  }

  const confirm = (e) => {
    e.preventDefault()
    // console.log("wants to confirm")
    setSwitchChecked(true)
    if (user.data.id === booking.provider_id) {
      validateAchievementByProvider({"status": "terminée"}, booking.booking_id)
      .then((res) => {
        if (res.status === 200){
          setProviderValidation(1)
          if (res.bookingStatus) {
            setBookingStatus(res.bookingStatus)
          }
        } else {
          setErrorForm("Une erreur est survenue.")
        }
      })
      .catch(err => setErrorForm("Une erreur est survenue."))
    } else {
      validateAchievementByBeneficiary({"status": "terminée"}, booking.booking_id)
      .then((res) => {
        if (res.status === 200){
          setBeneficiaryValidation(1)
          if (res.bookingStatus) {
            setBookingStatus(res.bookingStatus)
          }
        } else {
          setErrorForm("Une erreur est survenue.")
        }
      })
      .catch(err => setErrorForm("Une erreur est survenue."))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsgForm(null)
    setErrorForm(null)
    let data = {
      "title": title,
      "content": content,
      "score": parseInt(score),
      "author_id": user.data.id,
      "activity_id": booking.activity_id,
      "booking_id": booking.booking_id
    }
    saveOneComment(data)
    .then((res) => {
      if (res.status === 200){
        console.log(res)
        getOneCommentByBookingId(params.id)
        .then((response) => {
          if (response.status === 200){
            setComment(response.comment)
            setTitle(response.comment.title)
            setContent(response.comment.content)
            setScore(response.comment.score)
          }
        })
        .catch((error) => console.log(error))
        setMsgForm("Votre commentaire a bien été créé.")
      } else {
        setErrorForm(`${res.msg}`)
      }
    })
    .catch(()=>{setErrorForm("Une erreur est survenue.")})
  }

  const handleChange = (e) => {
    e.preventDefault()
    switch (e.currentTarget.name) {
      case "title":
        setTitle(e.currentTarget.value)
        break;
      case "content":
        setContent(e.currentTarget.value)
        break;
      case "score":
        setScore(e.currentTarget.value)
        break;
    }
  }

  const updateComment = (e) => {
    e.preventDefault(e)
    console.log("update")
    setMsgForm(null)
    setErrorForm(null)
    let data = {
      "title": title,
      "content": content,
      "score": parseInt(score)
    }

    updateOneComment(data, comment.id)
    .then((res)=> {
      if (res.status === 200){
        setMsgForm("Votre commentaire a bien été modifié.")
      } else {
        setErrorForm(`${res.msg}`)
      }
    })
    .catch(()=>{setErrorForm("Une erreur est survenue.")})
  }

  if (redirect){
    return <Navigate to={`/profile`}/>
  }

  if (booking !== null && bookingStatus !== null){
    return (
      <section className="booking">
        <h1>Réservation n°{booking.booking_id}</h1>

        <article className="booking-info">
          <h2>Informations sur la réservation</h2>
          <p>Activité: {booking.activity_title}</p>
          <p><FontAwesomeIcon icon={faLocationDot}/> {booking.activity_address}, {booking.activity_zip}, {booking.activity_city}</p>
          <p><FontAwesomeIcon icon={faCoins}/> {user.data.id === booking.provider_id ? "Gain" : "Coût"}: {booking.points} points</p>
        </article>

        <hr/>

        <article className="participants">
            <h2>Participants</h2>
          { provider !== null ?
            <div>
              {provider.avatar !== null ?
                <CloudinaryContext cloudName="dptcisxbs" className="profile-avatar">
                  <div>
                    <Image className="profile-avatar" publicId={provider.avatar} alt={`Votre photo de profil`}>
                      <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                  </div>
                </CloudinaryContext>
                :
                <img src={`${config.pict_url}/user.png`} className="profile-avatar" alt="Icône d'utilisateur" />
              }
              <p>{provider.firstName} {provider.lastName.substring(0, 1)}.</p>
              {bookingStatus === "en attente de réalisation" && <p><FontAwesomeIcon icon={faPhone}/> {provider.phone}</p>}
            </div>
            :
            <div>
              <img src={`${config.pict_url}/user.png`} className="profile-avatar" alt="Icône d'utilisateur" />
              <p>Inconnu</p>
            </div>
          }
          { beneficiary !== null ?
            <div>
              {beneficiary.avatar !== null ?
                <CloudinaryContext cloudName="dptcisxbs" className="profile-avatar">
                  <div>
                    <Image className="profile-avatar" publicId={beneficiary.avatar} alt={`Votre photo de profil`}>
                      <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                  </div>
                </CloudinaryContext>
                :
                <img src={`${config.pict_url}/user.png`} className="profile-avatar" alt="Icône d'utilisateur" />
              }
              <p>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</p>
              {bookingStatus === "en attente de réalisation" && <p><FontAwesomeIcon icon={faPhone}/> {beneficiary.phone}</p>}
            </div>
            :
            <div>
              <img src={`${config.pict_url}/user.png`} className="profile-avatar" alt="Icône d'utilisateur" />
              <p>Inconnu</p>
            </div>
          }
        </article>
        {/* <p style={{"color": "red"}}>Votre rôle: {user.data.id === booking.provider_id ? "vous allez réalisé l'activité" : "vous êtes le bénéficiaire de l'activité"}</p> */}

        <hr/>

        { bookingStatus === "en attente d'acceptation" &&
          <article className="waiting">
            <h3>La réservation est {bookingStatus}</h3>
            {parseInt(user.data.id) !== parseInt(booking.booker_id) &&
              <fieldset>
                <legend>Souhaitez-vous accepter la réservation?</legend>
                <input type="radio" id="answer-yes" name="answer" value="oui" onChange={(e) => {validateBooking(e)}} />
                <label htmlFor="answer" onClick={(e) => {validateBooking(e)}}>Oui</label>
                <input type="radio" id="answer-no" name="answer" value={false} onChange={(e) =>{declineBooking(e)}} />
                <label htmlFor="answer" onClick={(e) =>{declineBooking(e)}}>Non</label>
                { errorForm !== null && <p style={{color: "indianred"}}>{errorForm}</p>}
              </fieldset>
            }
            {parseInt(user.data.id) === parseInt(booking.booker_id) &&
              <button onClick={(e) =>{declineBooking(e)}}>Annuler ma demande de réservation</button>
            }
          </article>
        }

        { bookingStatus === "en attente de réalisation" &&
          <article className="confirmer">
            <h2>Avez-vous déjà réalisé l'activité ?</h2>
            {/* provider */}
            { user.data.id === booking.provider_id ?
              <div>
                { providerValidation === 1 ?
                <p>Vous avez confirmé la réalisation de l'activité.</p>
                :
                <div>
                    <p>Souhaitez-vous confirmer la réalisation de l'activité ?</p>
                    <label className="switch" htmlFor="checkbox">
                      <input type="checkbox" id="checkbox" checked={switchChecked} onChange={(e) => {confirm(e)}}/>
                      <div className="slider round"></div>
                    </label>
                    { errorForm !== null && <p style={{color: "red"}}>{errorForm}</p>}
                </div>
                }
              </div>
            :
            <div>
              { providerValidation === 1 ?
                  <p><FontAwesomeIcon icon={faThumbsUp} /> { provider !== null ? <span>{provider.firstName} {provider.lastName.substring(0, 1)}.</span> : <span>Inconnu</span> } a confirmé la réalisation de l'activité.</p>
                  :
                  <p>{ provider !== null ? <span>{provider.firstName} {provider.lastName.substring(0, 1)}.</span> : <span>Inconnu</span> } n'a pas encore confirmé la réalisation de l'activité.</p>}
            </div>
            }

            {/* beneficiary */}
            { user.data.id === booking.beneficiary_id ?
              <div>
                { beneficiaryValidation === 1 ?
                <p>Vous avez confirmé la réalisation de l'activité.</p>
                :
                <div>
                    <p>Souhaitez-vous confirmer la réalisation de l'activité ?</p>
                    <label className="switch" htmlFor="checkbox">
                      <input type="checkbox" id="checkbox" checked={switchChecked} onChange={(e) => {confirm(e)}}/>
                      <div className="slider round"></div>
                    </label>
                    { errorForm !== null && <p style={{color: "red"}}>{errorForm}</p>}
                </div>
                }
              </div>
            :
            <div>
              { beneficiaryValidation === 1 ?
                  <p><FontAwesomeIcon icon={faThumbsUp} /> { beneficiary !== null ? <span>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</span> : <span>Inconnu</span>} a confirmé la réalisation de l'activité.</p>
                  :
                  <p>{ beneficiary !== null ? <span>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</span> : <span>Inconnu</span>} n'a pas encore confirmé la réalisation de l'activité.</p>}
            </div>
            }

          </article>
        }

        { bookingStatus === "terminée" && comment !== null && comment.status === "validé" &&
          <CommentCard key={comment.id} comment={comment} />
        }

        { bookingStatus === "terminée" && comment !== null && comment.status !== "validé" && user.data.id === booking.booker_id &&
            <article className="finished">
              <h2>L'activité est maintenant terminée.</h2>
              <h2>Vous avez passé un bon moment? Faîtes passer le message!</h2>
              { comment.status === "en attente de validation" ?
                <p className="message-comment">Votre commentaire est en attente de validation. Vous pouvez encore le modifier.</p>
                :
                <p>Votre commentaire a été invalidé par l'administration. Vous pouvez le modifier.</p> }
              <form onSubmit={(e) => {updateComment(e)}}>
                <label htmlFor="title" >Titre de votre commentaire</label>
                <input type="text" name="title" onChange={(e) =>{handleChange(e)}} defaultValue={title} required></input>
                <label htmlFor="content">Décrivez votre expérience</label>
                <textarea name="content" rows="5" cols="33" onChange={(e) =>{handleChange(e)}} defaultValue={content} required></textarea>
                <label htmlFor="score">Quelle note donneriez-vous ?</label>
                <select name="score" onChange={(e) =>{handleChange(e)}} defaultValue={parseInt(score)} required>
                  <option value="">Choisissez une note</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
                <button>Modifier</button>
              { msgForm !== null && <p style={{color:"SeaGreen"}}>{msgForm}</p>}
              { errorForm !== null && <p style={{color:"IndianRed"}}>{errorForm}</p>}
              </form>
            </article>
        }

        { bookingStatus === "terminée" && comment === null && user.data.id === booking.booker_id &&
          <article className="finished">
            <h2>L'activité est maintenant terminée.</h2>
            <h2>Vous avez passé un bon moment? Faîtes passer le message!</h2>
            <form onSubmit={(e) => {handleSubmit(e)}}>
              <label htmlFor="title" >Titre de votre commentaire :</label>
              <input type="text" name="title" onChange={(e) =>{handleChange(e)}} required></input>
              <label htmlFor="content">Décrivez cette expérience :</label>
              <textarea name="content" rows="5" cols="33" onChange={(e) =>{handleChange(e)}} required></textarea>
              <label htmlFor="score">Quelle note donneriez-vous ?</label>
              <select name="score" onChange={(e) =>{handleChange(e)}} required>
                <option value="">Choisissez une note</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <button>Valider</button>
            </form>
            { msgForm !== null && <p style={{color:"SeaGreen"}}>{msgForm}</p>}
            { errorForm !== null && <p style={{color:"IndianRed"}}>{errorForm}</p>}
          </article>
        }

        { bookingStatus === "terminée" && (comment === null || (comment !== null && comment.status !== "validé")) && user.data.id !== booking.booker_id &&
          <article>
            <h2>L'activité est maintenant terminée.</h2>
            { provider !== null & beneficiary !== null &&
              <p>{ booking.activity_author_id !== provider.id ? `${provider.firstName}` : `${beneficiary.firstName}`} est invité.e à laisser un commentaire concernant votre activité.</p>
            }
          </article>
        }


      </section>
    )
  }

}

export default Booking;
