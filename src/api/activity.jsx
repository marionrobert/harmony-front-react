import axios from "axios"
import {config} from "../config"
const token = window.localStorage.getItem("harmony-token")

export const getAllActivities = () => {
  return axios.get(`${config.api_url}/api/v1/activity/all`)
  .then((res)=>{
    console.log("res de requête axios getAllActivities -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllActivities -->", err)
  })
}

export const getAllOnlineActivities = () =>{
  return axios.get(`${config.api_url}/api/v1/activity/all/online`)
  .then((res)=>{
    // console.log("res de requête axios getAllOnlineActivities -->", res)
    return res.data
  })
  .catch((err)=>{
    // console.log("err de requête axios getAllOnlineActivities -->", err)
  })
}

export const getAllWaitingActivities = () => {
  return axios.get(`${config.api_url}/api/v1/activity/all/waiting`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getAllWaitingActivities -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllWaitingActivities -->", err)
  })
}

export const getAllActivitiesByAuthor = (author_id) => {
  return axios.get(`${config.api_url}/api/v1/activity/all/author/${author_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getAllActivitiesByAuthor -->", res)
    return res.data
  })
  .catch((err)=>{
    // console.log("err de requête axios getAllActivitiesByAuthor -->", err)
  })
}

export const getAllActivitiesByAuthorIsProvider = () => {
  return axios.post(`${config.api_url}/api/v1/activity/all/author-is-provider`)
  .then((res)=>{
    console.log("res de requête axios getAllActivitiesByAuthorIsProvider -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllActivitiesByAuthorIsProvider -->", err)
  })
}

export const getOneActivity = (id) => {
  return axios.get(`${config.api_url}/api/v1/activity/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getOneActivity -->", res)
    return res.data
  })
  .catch((err)=>{
    // console.log("err de requête axios getOneActivity -->", err)
  })
}

export const saveOneActivity = (data) => {
  return axios.post(`${config.api_url}/api/v1/activity/save`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios saveOneActivity -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios saveOneActivity -->", err)
  })
}

export const getCoords = (address, city)=>{
  //requète ajax vers nominatim `https://nominatim.openstreetmap.org/search?q=${address} ${zip} ${city}'&format=geocodejson`
  return axios.get(`https://nominatim.openstreetmap.org/search?q=${address} ${city}'&format=geocodejson`)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

export const updateOneActivity = (data, id) => {
  return axios.put(`${config.api_url}/api/v1/activity/update/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios updateOneActivity -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateOneActivity -->", err)
  })
}

export const updateOnlineOfflineStatus = (data, id) => {
  return axios.put(`${config.api_url}/api/v1/activity/update/status/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios updateOnlineOfflineStatus -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateOnlineOfflineStatus -->", err)
  })
}

export const moderateOneActivity = (data, id) => {
  return axios.put(`${config.api_url}/api/v1/activity/moderate/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios moderateOneActivity -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios moderateOneActivity -->", err)
  })
}

export const deleteOneActivity = (id) => {
  return axios.delete(`${config.api_url}/api/v1/activity/delete/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios deleteOneActivity -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios deleteOneActivity -->", err)
  })
}

export const getAllActivitiesWithFilters = (data) => {
  return axios.post(`${config.api_url}/api/v1/activtity/all/filter`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios getAllActivitiesWithFilters -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllActivitiesWithFilters -->", err)
  })
}

export const updatePicture = (data, id) => {
  return axios.put(`${config.api_url}/api/v1/activity/update-picture/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios updatePicture -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updatePicture -->", err)
  })
}
