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
        setusers(u=>[...u,data.user])
      } 
      if (data.type=="leave") {
        setusers(u=>u.filter(x=>x.id!=data.userId))
      }
    }
  })
  
  return <div>
    roomId={ boardId}
    current users={JSON.stringify(users)}
  </div>
}