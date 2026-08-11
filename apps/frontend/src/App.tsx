import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

export default function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/board/:boardId" element={<Board/>} />
      </Routes>
    </BrowserRouter>
  </>
}

function Board() {
  const { boardId } = useParams()
  const [users,setusers]=useState([])
  // web socket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002")
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      console.log(data)
      if (data.type === "initial_state") {
        setusers(data.users)
      }
      if (data.type === "join") {
        console.log("joined a new user")
        setusers(u=>[...u,data.userId])
      } 
      if (data.type == "leave") {
        console.log("a user just leaved")
        
        setusers(u => u.filter(x => x !== data.userId))
        console.log(users,data.userId)
      }
    }
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        boardId
      }))
    }
  },[])
  
  return <div>
    roomId={ boardId}
    current users={JSON.stringify(users)}
  </div>
}