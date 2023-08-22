import { config } from "../config"
import { Link } from "react-router-dom"
import { getOneUserById } from "../api/user"
import { useState, useEffect } from "react"

const ActivityCard = (props) => {
  const activity = props.activity
  const [author, setAuthor] = useState(null)

  useEffect(()=> {
    getOneUserById(activity.author_id)
    .then((res)=>{
      if (res.status === 200){
        setAuthor(res.user)
      }
    })
    .catch((err)=>{
      console.log("err -->", err)
    })
  }, [activity])

  return (
    <>
      { activity !== null && <article className="activity-card">
        { activity.urlPicture !== null ? <img src={activity.urlPicture}/> : <img src={`${config.pict_url}/no-pict.jpg`} /> }
        <h3>{activity.title}</h3>
        <p>{activity.description.substring(0, 80)}...</p>
        <p className="activity-card-points">{activity.points} pts</p>
        { author !== null && author.avatar !== null ? <img src={author.avatar} className="activity-card-avatar"/> : <img src={`${config.pict_url}/user.png`} className="activity-card-avatar"/> }
        <button className="activity-card-btn"><Link to={`/activity/details/${activity.id}`}> Je découvre</Link></button>
      </article>
      }
    </>

  )
}

export default ActivityCard;
