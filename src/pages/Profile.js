import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState();
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((respones) => {
      setUsername(respones.data.username);
    });
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((respones) => {
      console.log("respones.data", respones.data);
      setListOfPosts(respones.data);
    });
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username: {username}</h1>
      </div>
      <div className="listOfPost">
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
                    // navigate(`/profind/${value.Likes}`);
                  }}
                >
                  {username}
                </div>
                <div className="buttons">
                  <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
