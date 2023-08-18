import axios from "axios";
import { config } from "../config";
const token = window.localStorage.getItem("harmony-token")


export const getAllBookings = () => {
  return axios.get(`${config.api_url}/api/v1/booking/all`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios getAllBookings -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllBookings -->", err)
  })
}

export const getAllBookingsByBookerId = (booker_id) => {
  return axios.get(`${config.api_url}/api/v1/booking/all/${booker_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios getAllBookingsByBookerId -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllBookingsByBookerId -->", err)
  })
}

export const getAllBookingsByAuthorId = (author_id) => {
  return axios.get(`${config.api_url}/api/v1/booking/all/activities/${author_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios getAllBookingsByAuthorId -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllBookingsByAuthorId -->", err)
  })
}

export const saveOneBooking = (data) => {
  return axios.post(`${config.api_url}/api/v1/booking/save`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios saveOneBooking -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios saveOneBooking -->", err)
  })
}

export const acceptBooking = (data, id) => {
  return axios.put(`${config.api_url}/api/v1/booking/accept-booking/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios acceptBooking -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios acceptBooking -->", err)
  })
}

export const deleteOneBooking = (id) => {
  return axios.delete(`${config.api_url}/api/v1/booking/delete/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios deleteOneBooking -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios deleteOneBooking -->", err)
  })
}

export const validateAchievementByBeneficiary = (id) => {
  return axios.put(`${config.api_url}/api/v1/bookings/validate-achievement/beneficiary/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios deleteOneBooking -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios deleteOneBooking -->", err)
  })
}

export const validateAchievementByProvider = (id) => {
  return axios.put(`${config.api_url}/api/v1/bookings/validate-achievement/provider/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios deleteOneBooking -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios deleteOneBooking -->", err)
  })
}
