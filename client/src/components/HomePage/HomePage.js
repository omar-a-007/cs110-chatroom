import React, { useEffect, useState } from "react"
import Loader from "react-loader-spinner"
import { Redirect } from "react-router"

import { joinChatRoom, getChatRooms } from "../../utils/requests"
import {ACCESS_TOKEN_NAME} from '../../constants/constants'
import Rooms from './Rooms/Rooms'
import "./HomePage.css"
import "../ChatRoom/ChatRoom.css"

const getChatRoomId = () => localStorage.getItem("chatRoomId")

function HomePage() {
  const [initialized, setInitialized] = useState(false)
  const [rooms, setRooms] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [redirectLogin, setRedirectLogin] = useState(false)
  const [redirectCreateRoom, setRedirectCreateRoom] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [search, setSearch] = useState('')
  
  const getRooms = async () => {
    setInitialized(true);
    setSpinner(true)
    const response = await getChatRooms()
    setRooms(response.data)
    setSpinner(false)
  }


  useEffect(() => {
    if (!initialized) { getRooms()}
  }, [isLoading])

  async function createRoomHandler() {
    if(!localStorage.getItem(ACCESS_TOKEN_NAME))
      setRedirectLogin(true)

    console.log("createRoomHandler clicked")
    setRedirectCreateRoom(true)
  }

  
  async function handleClick(id,name,evt,i){
    if(!localStorage.getItem(ACCESS_TOKEN_NAME))
      setRedirectLogin(true)

    setLoading(true);
    localStorage.setItem("chatRoomId", id)
    localStorage.setItem("chatRoomName", name)
    let token = localStorage.getItem(ACCESS_TOKEN_NAME)
    evt.target.innerHTML = 'Joining...'
    try{
      await joinChatRoom(id, token)
      setRedirect(true)
    }catch(err){
      console.log("joinChatRoom error")
      console.log(err)
      
      localStorage.removeItem(ACCESS_TOKEN_NAME)
      setLoading(false);
      setRedirectLogin(true)
    }
  }

  async function sortRoomHandler(event) {
    event.preventDefault()
    
    let curDirection = event.target.innerHTML.indexOf("Oldest")
    event.target.innerHTML = curDirection === -1 ? "Sort By Oldest <i class='ml-1 fas fa-sort-up'></i>" : "Sort By Newest <i class='ml-1 fas fa-sort-down'></i>"
    
    setRooms([...rooms.reverse()]) // by spreading the element with ..., the update is forced through.
  }

  async function handleSearch(event) {
    event.preventDefault(); 

    console.log(search)
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true;

    script.innerHTML = `
    (function() {
      
      let ssearch = document.getElementById('Search')
      // The way react reloads causes the page to error out as search will already be set upon reload
      // While only problematic when in dev mode (for the most part), this should handle that edge case
      // Wrap everything in an anonymous function, check if an ficticious attribute exists, if not, proceed and add that attribute
      if (ssearch.getAttribute('listener') !== 'true') {
        ssearch.setAttribute('listener', 'true');
        ssearch.addEventListener('input', event => {      
            var query = ssearch.value.toLowerCase();
    
            let rooms =  document.getElementsByTagName('li');
            for(let i = 0; i < rooms.length; i++)
            {
              let room_name = rooms[i].getElementsByClassName('room_name')[0];
                if (room_name.innerHTML.indexOf(query) == -1) {
                  rooms[i].hidden = true
                }
                else {
                  rooms[i].hidden = false
                }
            }
        })
      }

    })();
    `

    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  if (redirect)            return <Redirect to="/chatroom" />
  if (redirectLogin)       return <Redirect to='/login' />
  if (redirectCreateRoom)  return <Redirect to='/createroom' />


  return (    
    <div className="home-page container-fluid pt-3 mr-0 ml-0 pl-0 pr-0">

      <div className="input-group">
        <div className="text-center float-left">
          <button className="btn btn-secondary mb-3 ml-2 mr-5" onClick={() => createRoomHandler() }> + Create New Room +</button>
        </div>
        <input type="text"  id="Search" placeholder="Search..." name="" value={search} className="form-control search" autoComplete={false}
                onChange={(event) => setSearch(event.target.value)}
                onKeyPress={(event) => event.key === 'Enter' ? handleSearch(event) : null}  />
        <div className="input-group-prepend mr-2">
          <span className="input-group-text search_btn"><i id="search_icon" style={{color: "rgba(255,255,255,0.5)"}} className="fas fa-search"></i></span>
        </div>

        <div>
          <button className="btn btn-secondary mb-3 ml-2 mr-2 sort_btn" style={{width: "150px"}} data-tag="asc" onClick={(event) => sortRoomHandler(event) }>
            Sort By Newest <i className="ml-1 fas fa-sort-down"></i>
          </button>
        </div>
      </div>

      <div className="text-center"> {spinner ? <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} /> : ''}  </div>

      <ul className="rooms m-2 mb-0 mt-0">
        <Rooms rooms={rooms} last_room_id={getChatRoomId()} handler={handleClick}  />
      </ul>

    </div>
  )
}
export default HomePage
