import { config } from "../config"
import { getOneUserById } from "../api/user"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar} from "@fortawesome/free-solid-svg-icons"

const CommentCard = (props) => {
  const comment = props.comment
  const [author, setAuthor] = useState(null)

  useEffect(()=> {
    getOneUserById(comment.author_id)
    .then((res)=>{
      if (res.status === 200){
        setAuthor(res.user)
      }
    })
    .catch((err)=>{
      console.log("err -->", err)
    })
  }, [comment])

  return (
    <>
      { comment !== null && <article className="comment-card">
        <h3>{comment.title}</h3>
        <p>{comment.content.substring(0, 50)}...</p>
        <p>{comment.score} <FontAwesomeIcon icon={faStar}/></p>
        { author !== null && author.avatar !== null ? <img src={author.avatar} className="activity-card-avatar"/> : <img src={`${config.pict_url}/user.png`} className="activity-card-avatar"/> }
      </article>
      }
    </>

  )
}

export default CommentCard;
