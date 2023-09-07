import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getOneBooking } from "../api/booking";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import {getOneUserById} from "../api/user"
import { acceptBooking, deleteOneBooking, validateAchievementByBeneficiary, validateAchievementByProvider } from "../api/booking";


const Booking = () => {
  const params = useParams()
  const [booking, setBooking] = useState(null)
  const [provider, setProvider] = useState(null)
  const [beneficiary, setBeneficiary] = useState(null)
  const user = useSelector(selectUser)
  const [errorForm, setErrorForm] = useState(null)
  const [redirect, setRedirect]  = useState(null)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [bookingStatus, setBookingStatus] = useState(null)

  useEffect(()=>{
    getOneBooking(parseInt(params.id))
    .then((res)=>{
      if (res.status === 200){
        setBooking(res.booking)
        setBookingStatus(res.booking.booking_status)

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
      }
    })
    .catch(err => console.log(err))
  }, [params.id])


  const validateBooking = (e) => {
    e.preventDefault()
    acceptBooking({"status": "en attente de réalisation"}, booking.booking_id)
    .then((res)=>{
      if (res.status === 200){
        setBooking(res.bookingUpdated)
      } else {
        setErrorForm(res.msg)
      }
    })
    .catch(() => {setErrorForm("Une erreur est survenue")})
  }

  const declineBooking = (e) => {
    e.preventDefault()
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
    console.log("wants to confirm")
    setSwitchChecked(true)
    if (user.data.id === booking.provider_id) {
      validateAchievementByProvider({"status": "terminée"}, booking.booking_id)
      .then((res) => {
        if (res.status === 200){
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

  if (redirect){
    return <Navigate to={`/profile`}/>
  }

  if (booking !== null && bookingStatus !== null){
    // console.log(typeof booking.providerValidation)
    return (
      <section className="booking">
        <h1>Réservation n° {booking.booking_id}</h1>
        <article className="booking-data" style={{border: "1px solid black"}}>
          <h2>Informations sur l'activité</h2>
          <p>Activité: {booking.activity_title}</p>
          <p>Lieu de rendez-vous: {booking.activity_address}, {booking.activity_zip}, {booking.activity_city}</p>
          <p> {user.data.id === booking.provider_id ? "Gain" : "Coût"}: {booking.points} points</p>
          <h2>Participants : { provider !== null ? <span>{provider.firstName} {provider.lastName.substring(0, 1)}.</span> : <span>Inconnu</span> }  &  { beneficiary !== null ? <span>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</span> : <span>Inconnu</span>}</h2>
          <p>Votre rôle: {user.data.id === booking.provider_id ? "vous allez réalisé l'activité" : "vous êtes le bénéficiaire de l'activité"}</p>
        </article>

        { bookingStatus === "en attente d'acceptation" &&
          <article>
            <h2>Statut de la réservation: {bookingStatus}</h2>
            {parseInt(user.data.id) !== parseInt(booking.booker_id) &&
              <fieldset>
                <legend>Souhaitez-vous accepter la réservation?</legend>
                <input type="radio" name="answer" value="oui" onChange={(e) => {validateBooking(e)}} />
                <label htmlFor="answer">Oui</label>
                <input type="radio" name="answer" value={false} onChange={(e) =>{declineBooking(e)}} />
                <label htmlFor="answer">Non</label>
                { errorForm !== null && <p style={{color: "firebrick"}}>{errorForm}</p>}
              </fieldset>
            }
            {parseInt(user.data.id) === parseInt(booking.booker_id) &&
              <button onClick={(e) =>{declineBooking(e)}}>Annuler ma demande de réservation</button>
            }
          </article>
        }

        { bookingStatus === "en attente de réalisation" &&
          <article style={{border: "1px solid blue"}} className="confirmer">
            <h2>Avez-vous déjà réalisé l'activité ?</h2>
            {/* provider */}
            { user.data.id === booking.provider_id ?
              <div>
                { booking.providerValidation === 1 ?
                <p>Vous avez confirmé la réalisation de l'activité.</p>
                :
                <div>
                    <p>Confirmer la réalisation de l'activité ?</p>
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
              { booking.providerValidation === 1 ?
                  <p>{ provider !== null ? <span>{provider.firstName} {provider.lastName.substring(0, 1)}.</span> : <span>Inconnu</span> } a confirmé la réalisation de l'activité.</p>
                  :
                  <p>{ provider !== null ? <span>{provider.firstName} {provider.lastName.substring(0, 1)}.</span> : <span>Inconnu</span> } n'a pas encore confirmé la réalisation de l'activité.</p>}
            </div>
            }

            {/* beneficiary */}
            { user.data.id === booking.beneficiary_id ?
              <div>
                { booking.beneficiaryValidation === 1 ?
                <p>Vous avez confirmé la réalisation de l'activité.</p>
                :
                <div>
                    <p>Confirmer la réalisation de l'activité ?</p>
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
              { booking.providerValidation === 1 ?
                  <p>{ beneficiary !== null ? <span>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</span> : <span>Inconnu</span>} a confirmé la réalisation de l'activité.</p>
                  :
                  <p>{ beneficiary !== null ? <span>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</span> : <span>Inconnu</span>} n'a pas encore confirmé la réalisation de l'activité.</p>}
            </div>
            }

          </article>
        }

        { bookingStatus === "terminée" &&
          <article style={{border: "1px solid red"}} className="finished">
            <h2>L'activité est réalisée.</h2>
            { user.data.id === booking.booker_id && <p>si je suis le booker, je vais pouvoir laisser un commentaire !</p> }
          </article>
        }
      </section>
    )
  }

}

export default Booking;
