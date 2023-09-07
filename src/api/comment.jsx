import axios from "axios";
import { config } from "../config";
const token = window.localStorage.getItem("harmony-token")


export const getAllComments = () => {
  return axios.get(`${config.api_url}/api/v1/comment/all`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios getAllComments -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllComments -->", err)
  })
}

export const getAllWaitingComments = () => {
  return axios.get(`${config.api_url}/api/v1/comment/all/waiting`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getAllWaitingComments -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllWaitingComments -->", err)
  })
}

export const getOneCommentById = (id) => {
  return axios.get(`${config.api_url}/api/v1/comment/one/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getOneCommentById -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getOneCommentById -->", err)
  })
}

export const getOneCommentByBookingId = (booking_id) => {
  return axios.get(`${config.api_url}/api/v1/comment/one/booking/${booking_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getOneCommentByBookingId -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getOneCommentByBookingId -->", err)
  })
}

export const getAllCommentsByActivityId = (activity_id) => {
  return axios.get(`${config.api_url}/api/v1/comment/all/activity/${activity_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getAllCommentsByActivityId -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllCommentsByActivityId -->", err)
  })
}

export const getAllHighScoreComments = () => {
  return axios.get(`${config.api_url}/api/v1/comment/all/highscore`)
  .then((res)=>{
    // console.log("res de requête axiosgetAllHighScoreComments -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axiosgetAllHighScoreComments -->", err)
  })
}

export const saveOneComment = (data) => {
  return axios.post(`${config.api_url}/api/v1/comment/save`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios saveOneComment -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios saveOneComment -->", err)
  })
}

export const updateOneComment = (data, id) => {
  return axios.put(`${config.api_url}/api/v1/comment/update/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios updateOneComment -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateOneComment -->", err)
  })
}

export const deleteOneComment = (id) => {
  return axios.delete(`${config.api_url}/api/v1/comment/delete/${id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios deleteOneComment -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios deleteOneComment -->", err)
  })
}

export const moderateComment = (id, data) =>{
  return axios.put(`${config.api_url}/api/v1/comment/moderate/${id}`, data, {headers: {"x-access-token": token}})
  .then((res)=>{
    console.log("res de requête axios updateOneComment -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios updateOneComment -->", err)
  })
}

export const getAllCommentsByAuthorId = (author_id) => {
  return axios.get(`${config.api_url}/api/v1/comment/all/author/${author_id}`, {headers: {"x-access-token": token}})
  .then((res)=>{
    // console.log("res de requête axios getAllCommentsByAuthorId -->", res)
    return res.data
  })
  .catch((err)=>{
    console.log("err de requête axios getAllCommentsByAuthorId -->", err)
  })
}
