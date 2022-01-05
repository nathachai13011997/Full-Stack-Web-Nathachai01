import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import { AuthContext } from "./helpers/AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id:0,
    status: false
  });
  
  useEffect(() => {
      if(localStorage.getItem('accessToken')){
        axios.get("https://full-stack-api-nathachai01.herokuapp.com/auth/auth",{ headers: { accessToken:localStorage.getItem("accessToken") }}).then((respones)=>{
          if(respones.data.error){
            setAuthState({...authState, status: false });
            localStorage.removeItem("accessToken");
            window.location="/login";
          }else{
            setAuthState({
              username: respones.data.username,
              id: respones.data.id,
              status: true
            });
          }
        })
      }
  }, [])

  const logout =  () => {
      localStorage.removeItem("accessToken");
      setAuthState({username: "", id: 0, status: false });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="/">Home Page</Link>
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            ) : (
              <Link to="/createpost">Create A Post</Link>
            )}
            <div className="loggedInContainer">
              <h1>{ authState.username }</h1>
              <Link to="/login">{ authState.status && <button onClick={logout}>Logout</button>}</Link>
             
            </div>
          </div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/createpost" element={<CreatePost />} />
            <Route exact path="/post/:id" element={<Post />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/registration" element={<Registration />} />
            <Route exact path="/profile/:id" element={<Profile />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
