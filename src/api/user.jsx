import axios from "axios"
import {config} from "../config"
const token = window.localStorage.getItem('harmony-token')

export const saveUser = (data) => {
  return axios.post(`${config.api_url}/api/v1/user/register`, data)
  .then((res)=>{
    console.log("res appel api saveUser -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("erreur appel api saveUser -->", err)
  })
}

export const loginUser = (data) => {
  return axios.post(`${config.api_url}/api/v1/user/login`, data)
  .then((res)=>{
    // console.log("res appel api loginUser -->", res)
    return res.data
  })
  .catch((err)=>{
    // console.log("erreur appel api loginUser -->", err)
  })
}

export const forgotPassword = (data) => {
  return axios.post(`${config.api_url}/api/v1/user/forgotPassword`, data)
  .then((res)=>{
    console.log("res de requête axios forgotPassword -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios forgotPassword -->", err)
  })
}

export const updateUser = (data, key_id) => {
  return axios.put(`${config.api_url}/api/v1/user/update/${key_id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios updateUser -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateUser -->", err)
  })
}

export const updateAvatar = (data, key_id) =>{
  return axios.put(`${config.api_url}/api/v1/user/update-avatar/${key_id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios updateAvatar -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateAvatar -->", err)
  })
}

export const getOneUser = (key_id) => {
  return axios.get(`${config.api_url}/api/v1/user/one/${key_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios getOneUser -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getOneUser -->", err)
    return err.response.data
  })
}

export const getOneUserById = (id) => {
  return axios.get(`${config.api_url}/api/v1/user/one/id/${id}`)
  .then((res)=>{
    // console.log("res de requête axios  -->", res)
    return res.data
  })
  .catch((err)=>{
    // console.log("err de requête axios export const  -->", err)
    return err.response.data
  })
}
