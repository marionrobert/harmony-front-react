import axios from "axios"
import {config} from '../config'
// const token = window.localStorage.getItem("harmony-token")


export const getAllCategories = () => {
  const token = window.localStorage.getItem("harmony-token")
  return axios.get(`${config.api_url}/api/v1/category/all`,  {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getAllCategories -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllCategories -->", err)
  })
}

export const getOneCategory = (id) => {
  const token = window.localStorage.getItem("harmony-token")
  return axios.get(`${config.api_url}/api/v1/category/one/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getOneCategory -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getOneCategory -->", err)
  })
}

export const getOneCategoryByTitle = (data) => {
  const token = window.localStorage.getItem("harmony-token")
  return axios.posth(`${config.api_url}/api/v1/category/one/title`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getOneCategoryByTitle -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getOneCategoryByTitle -->", err)
  })
}

export const saveOneCategory = (data) => {
  const token = window.localStorage.getItem("harmony-token")
  return axios.post(`${config.api_url}/api/v1/category/save`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios saveOneCategory -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios saveOneCategory -->", err)
  })
}

export const updateOneCategory = (data, id) => {
  const token = window.localStorage.getItem("harmony-token")
  return axios.put(`${config.api_url}/api/v1/category/update/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios updateOneCategory -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateOneCategory -->", err)
  })
}

export const deleteOneCategory = (id) => {
  const token = window.localStorage.getItem("harmony-token")
  return axios.delete(`${config.api_url}/api/v1/category/delete/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios deleteOneCategory -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios deleteOneCategory -->", err)
  })
}
