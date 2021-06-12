import React, {useState}from "react"
import { Router, Route } from "react-router-dom"
import { createBrowserHistory as createHistory } from "history"

import HomePage from "./components/HomePage/HomePage"
import TopBar from "./components/TopBar/TopBar"
import ChatRoom from "./components/ChatRoom/ChatRoom"
import CreateRoom from "./components/CreateRoom/CreateRoom"
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Profile from './components/Profile/Profile'

import PrivateRoute from './utils/PrivateRoute'

import "./App.css"


const history = createHistory()
function App() {
  const [title, updateTitle] = useState(null)
  //const [errorMessage, updateErrorMessage] = useState(null);

  return (
    <div className="App">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <Router history={history}>
        <TopBar />
        <Route path="/" exact component={HomePage} />
        <Route path="/chatroom" exact component={ChatRoom} />
        
        <PrivateRoute path="/createroom">
          <CreateRoom/>
        </PrivateRoute>

        <PrivateRoute path="/profile">
            <Profile/>
        </PrivateRoute>

        <Route path="/signup">
          <Register updateTitle={updateTitle}/>
        </Route>
        
        <Route path="/login">
          <Login updateTitle={updateTitle}/>
        </Route>

      </Router>
    </div>
  )
}
export default App