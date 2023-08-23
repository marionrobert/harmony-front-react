import { config } from "../config"
import { getOneUserById } from "../api/user"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as fullStar} from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-regular-svg-icons"

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
      { comment !== null && author !== null && <article className="comment-card">
        { author.avatar !== null ? <img src={author.avatar} className="comment-card-avatar"/> : <img src={`${config.pict_url}/user.png`} className="comment-card-avatar"/> }

        <div className="comment-card-data">
          <h3 className="comment-card-username" >{author.firstName} {author.lastName.substring(0, 1).toUpperCase()}.</h3>
          <p className="comment-card-score">
            <FontAwesomeIcon icon={fullStar}/>
            <FontAwesomeIcon icon={fullStar}/>
            <FontAwesomeIcon icon={fullStar}/>
            <FontAwesomeIcon icon={fullStar}/>
            { comment.score === 5 ? <FontAwesomeIcon icon={fullStar}/> : <FontAwesomeIcon icon={faStar}/> } {comment.score}/5
          </p>
        </div>

        <h3 className="comment-card-title">{comment.title}</h3>
        <p>« {comment.content} »</p>
      </article>
      }
    </>

  )
}

export default CommentCard;
