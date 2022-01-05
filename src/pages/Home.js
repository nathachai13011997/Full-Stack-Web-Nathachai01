import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
function Home() {
  const { authState } = useContext(AuthContext);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/posts").then((response) => {
      // console.log(response.data);
      setListOfPosts(response.data);
    });

    axios.get("http://localhost:3001/auth").then((response) => {
      // console.log(response.data);
      setListOfUsers(response.data);
    });
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((respones) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (respones.data.Liked) {
                return {
                  ...post,
                  Likes: [...post.Likes, { UserId: authState.id }],
                };
              } else {
                const likedArray = post.Likes;
                const findIndexFound = likedArray.findIndex(
                  (value) => value.UserId === authState.id
                );
                // likedArray.pop();
                likedArray.splice(findIndexFound, 1);
                return { ...post, Likes: likedArray };
              }
            } else {
              return post;
            }
          })
        );
        // alert(respones.data);
      });
  };

  const likesPost = (likes) => {
    const found = likes.find((value) => value.UserId === authState.id);
    return found ? true : false;
  };

  const cellUsername = (value) =>{
    const dataUser =  listOfUsers.find((val)=> value.UserId === val.id );
    return dataUser?.username;
  }

  return (
    <div className="App">
      {listOfPosts.map((value, key) => {
        return (
          <div className="post" key={key}>
            <div className="title">{value.title}</div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div
                className="username"
                onClick={() => {
                  navigate(`/profile/${value.UserId}`);
                }}
              >
                {cellUsername(value)}
              </div>
              <div className="buttons">
                {authState.status && (
                  <>
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      onClick={() => {
                        likeAPost(value.id);
                      }}
                      className={
                        likesPost(value.Likes) ? "unlikeBttn" : "likeBttn"
                      }
                    ></FontAwesomeIcon>
                  </>
                )}
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
