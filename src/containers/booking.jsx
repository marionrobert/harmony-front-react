import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getOneBooking } from "../api/booking";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import {getOneUserById} from "../api/user"
import { acceptBooking, deleteOneBooking } from "../api/booking";


const Booking = () => {
  const params = useParams()
  const [booking, setBooking] = useState(null)
  const [provider, setProvider] = useState(null)
  const [beneficiary, setBeneficiary] = useState(null)
  const user = useSelector(selectUser)
  const [errorForm, setErrorForm] = useState(null)
  const [redirect, setRedirect]  = useState(null)

  useEffect(()=>{
    getOneBooking(parseInt(params.id))
    .then((res)=>{
      if (res.status === 200){
        setBooking(res.booking)

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
  }, [])

  const validateBooking = (e) => {
    e.preventDefault()
    console.log("j'accepte le booking")
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
    console.log("je refuse le booking")
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

  if (redirect){
    return <Navigate to={`/profile`}/>
  }

  if (booking !== null ){

    return (
      <>
      <section>
        <h1>Réservation n° {booking.booking_id}</h1>
        <article>
          <h2>Statut de la réservation: {booking.booking_status}</h2>
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
        </article>
        <article style={{border: "1px solid black"}}>
          <h2>Informations sur l'activité</h2>
          <p>Activité: {booking.activity_title}</p>
          <p>Lieu de rendez-vous: {booking.activity_address}, {booking.activity_zip}, {booking.activity_city}</p>
          <p> {user.data.id === booking.provider_id ? "Gain" : "Coût"}: {booking.points} points</p>
          <p>Votre rôle: {user.data.id === booking.provider_id ? "vous allez réalisé l'activité" : "vous êtes le bénéficiaire de l'activité"}</p>
        </article>
        <article style={{border: "1px solid blue"}}>
          <h2>Participants : { provider !== null ? <span>{provider.firstName} {provider.lastName.substring(0, 1)}.</span> : <span>Inconnu</span> }  &  { beneficiary !== null ? <span>{beneficiary.firstName} {beneficiary.lastName.substring(0, 1)}.</span> : <span>Inconnu</span>}</h2>
        </article>
      </section>



      </>
    )
  }

}

export default Booking;
