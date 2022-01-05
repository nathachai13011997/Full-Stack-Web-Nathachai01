import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext'

function Post() {
  let { id } = useParams();
  let navigate  = useNavigate ();
  const [postObject, setPostObject] = useState({});
  const [username, setUsername] = useState();
  const [comments, setComments ] = useState([]);
  const [newComent, setNewComment ] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
      let data = { UserId: response.data.UserId};
      axios.post(`http://localhost:3001/auth/byIduser`,data).then((response) => {
      setUsername(response.data.username);
      });
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios.post(`http://localhost:3001/comments`, {commentBody: newComent, PostId: id },{ headers:{ accessToken: localStorage.getItem('accessToken')} }).then((response) => {
        if(response.data.error){
          alert("Please login.");
        }else{
          const commentToAdd = { commentBody: newComent, username: response.data.username };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  }

  const deleteComment = (id) =>{
    axios.delete(`http://localhost:3001/comments/${id}`, {headers: { accessToken: localStorage.getItem('accessToken') }}).then((respones)=>{
      setComments(comments.filter((val)=>{
        return val.id !== id 
      }))
    })
  }

  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`, {headers: { accessToken: localStorage.getItem('accessToken') }}).then((respones)=>{
      navigate("/");
    })
  }

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
            <div className="title">{postObject.title}</div>
            <div className="body">{postObject.postText}</div>
            <div className="footer">{username} {authState.username === username && <button onClick={()=>{deletePost(postObject.id)}} >Delete Post</button>}</div>
        </div>
      </div>
      <div className="rightSide">
          <div className="addCommentContainer">
              <input type="text" placeholder="Comment..." value={newComent} autoComplete="off" onChange={(e)=>{ setNewComment(e.target.value) }} />
              <button onClick={addComment} >Add Comment</button>
          </div>
          <div className="listOfComments">
              {comments.map((comment, key)=>{
                  return (
                    <div key={key} className="comment">
                    {comment.commentBody}
                    <label> Username: {comment.username}</label>
                    {authState.username === comment.username && <button onClick={()=>{ deleteComment(comment.id) }}>X</button>}
                    </div>
                    )
              })}
          </div>
      </div>
    </div>
  );
}

export default Post;
