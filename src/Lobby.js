import React, { useState, useEffect } from "react";
import {firebase, auth} from "./firebase";
import { Link} from 'react-router-dom';
const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState("");
  const [check,setcheck] = useState(false);


  useEffect(() => {
    const dbRef = firebase.database().ref("rooms");
    dbRef.on("value", (snapshot) => {
      const roomsData = snapshot.val();
      const newRooms = [];
      for (let room in roomsData) {
        if (roomsData[room].gameStarted) {
          newRooms.push({ id: room, name: roomsData[room].name, gameStarted: true });
        } else {
          newRooms.push({ id: room, name: roomsData[room].name });
        }
      }
      setRooms(newRooms);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setcheck(true);
      }
    });

    return unsubscribe;
  }, []);
  
  const handleCreateRoom = () => {
    console.log(12344);
    if (newRoomName === undefined) {
      setNewRoomName("Rooom");
    }
    const dbRef = firebase.database().ref("rooms");
    dbRef.orderByChild("name").equalTo(newRoomName).once("value", (snapshot) => {
      if (snapshot.exists()) {
        setError("Комната с таким именем уже существует.");
      } else {
        dbRef.push({ name: newRoomName });
        setNewRoomName("");
        setError(null);
      }
    });
  };
  
  const handleDeleteRoom = (roomId) => {
    const dbRef = firebase.database().ref(`rooms/${roomId}`);
    dbRef.child("players").once("value", (snapshot) => {
      const players = snapshot.val() || {};
      const currentUser = firebase.auth().currentUser.uid;
      if (Object.keys(players).includes(currentUser) || Object.keys(players).length === 0) {
        dbRef.remove();
      } else {
        console.error("Доступ запрещён!");
      }
    });
  };
    if(!check)
    {
      return(
        <center><h4><Link to={`/login`}>Войдите</Link>, для продолжения.</h4></center>
      )
    }
  return (
    <div>
     <center> <h1>Список комнат:</h1></center>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
           <center><h2>Комната -  {room.name}</h2></center>
           <div>
              {!room.gameStarted ? (
                <Link to={`/room/${room.id}`}>
                  <button className="end-game-button">Войти</button>
                </Link>
              ) : (
                <center><h4>Игра уже началась.</h4></center>
              )}
            </div>
            <button className="end-game-button" onClick={() => handleDeleteRoom(room.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <div>
       <center> <input
          type="text"
          value={newRoomName}
          onChange={(event) => setNewRoomName(event.target.value)}
        /></center>
        <button className="end-game-button" onClick={handleCreateRoom}>Создать комнату</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Lobby;