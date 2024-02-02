import React, { useEffect, useState, useRef } from 'react';
import { firebase, auth } from './firebase';
import { Link, useParams } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [lobbytimeLeft, setLobbyTimeLeft] = useState(10);
  const lobbyintervalRef = useRef();
  const intervalRef = useRef();
  const [score, setScore] = useState(0);
  const [areAllPlayersReady, setareAllPlayersReady] = useState(null);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [maxScore,setmaxScore] = useState(-999999999);
  const [winner,setwinner] = useState('');
  const [gameEnd, setGameEnd] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const dbRef = firebase.database().ref(`rooms/${roomId}`);
    dbRef.on('value', (snapshot) => {
      const roomData = snapshot.val();
      if (roomData) {
        setRoomName(roomData.name);
        setIsReady(areAllPlayersReady);
        setGameStarted(roomData.gameStarted);
        setCurrentPlayerName(roomData.currentPlayerName)
        setGameEnd(roomData.gameEnd);
      }
    });
    return () => {
      dbRef.off();
    };
  }, [roomId, players]);

  useEffect(() => {
    const areAllPlayersReady1 = players.every((player) => player.isReady);
    setareAllPlayersReady(areAllPlayersReady1);
  }, [players]);
  

  useEffect(() => {
    const quizRef = firebase.firestore().collection('themes');
    quizRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      const randomIndexes = [];
      while(randomIndexes.length < 2){
        const randomIndex = Math.floor(Math.random() * data.length);
        if(!randomIndexes.includes(randomIndex)){
          randomIndexes.push(randomIndex);
        }
      }
      const quizData = [data[randomIndexes[0]], data[randomIndexes[1]]];
      setQuizData(quizData);
    });
    const dbRef2 = firebase.database().ref(`rooms/${roomId}/quizData`);
        dbRef2.set(quizData);
    
  }, []);
  
  useEffect(() => {
    const dbRef = firebase.database().ref(`rooms/${roomId}/players`);
    dbRef.on('value', (snapshot) => {
      const playersData = snapshot.val();
      if (playersData) {
        const playersArray = Object.keys(playersData).map((key) => {
          return {
            id: key,
            name: playersData[key].name,
            isReady: playersData[key].isReady,
            score: playersData[key].score
          };
        });
        setPlayers(playersArray);
      }
    });
    return () => {
      dbRef.off();
    };
  }, [roomId]);

    useEffect(() => {
      if (currentQuiz) {
        setTimeLeft(10);
        intervalRef.current = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
      return () => {
        clearInterval(intervalRef.current);
      };
    }, [currentQuiz]);

    useEffect(()=>{
        if(currentQuiz && timeLeft < 0 )
        {
          handleAnswerClick(false);
        }
    },[currentQuiz,timeLeft])

    useEffect(() => {
      if (gameStarted && !currentQuiz && playerName === currentPlayerName && !gameEnd) {
        setLobbyTimeLeft(10);
        lobbyintervalRef.current = setInterval(() => {
          setLobbyTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
      return () => {
        clearInterval(lobbyintervalRef.current);
      };
    }, [currentQuiz, currentPlayerName]);
    useEffect(() => {
      if(gameStarted && playerName === currentPlayerName && lobbytimeLeft <= 0 && !gameEnd)
      {
        let randomPlayerName;
        if(players.length === 1)
        {
          randomPlayerName = playerName;
        }
        else
        {
          const filteredPlayers = players.filter(player => player.name !== currentPlayerName);
          const randomIndex = Math.floor(Math.random() * filteredPlayers.length);
          randomPlayerName = filteredPlayers[randomIndex].name;
        }
        const dbRef1 = firebase.database().ref(`rooms/${roomId}`);
        dbRef1.update({
        currentPlayerName:randomPlayerName
      });
      }
    },[lobbytimeLeft]);

    useEffect(() => {
      if(gameStarted && (quizData !== []) && (playerName === currentPlayerName))
      {
        const dbRef = firebase.database().ref(`rooms/${roomId}/quizData`);
        dbRef.set(quizData);
        return () => {
        dbRef.off();
      };
      }
    }, [quizData, roomId, currentPlayerName, playerName]);

    useEffect(() => {
      if(gameStarted && (quizData !== []) && (playerName !== currentPlayerName))
      {
        const dbRef = firebase.database().ref(`rooms/${roomId}/quizData`);
      dbRef.on('value', (snapshot) => {
        const quizData = snapshot.val();
        setQuizData(quizData);
      });
      return () => {
        dbRef.off();
      };
      }
    }, [roomId,currentPlayerName,playerName]);


  const handleStartGame = () => {
    setGameStarted(true);
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayerName = players[randomIndex].name;
    setCurrentPlayerName(randomPlayerName)
    const dbRef = firebase.database().ref(`rooms/${roomId}`);
    dbRef.update({
      gameStarted: true,
      currentPlayerName: randomPlayerName,
      gameEnd: false
    });
  };

 const handleQuizClick = (topicIndex, questionIndex) => {
    const selectedQuiz = quizData[topicIndex].questions[questionIndex];
    if (selectedQuiz.answered) {
      return;
    }
    clearInterval(intervalRef.current);
    setTimeLeft(10);
    setCurrentQuiz({ ...selectedQuiz, topicIndex, questionIndex });
    clearInterval(lobbyintervalRef.current);
  };



  const handleAnswerClick = (isCorrect) => {
    clearInterval(intervalRef.current);
    const updatedQuizData = [...quizData];
    const currentTopic = updatedQuizData[currentQuiz.topicIndex];
    let currentQuestion;
    if(currentTopic !== null)
    {
      currentQuestion = currentTopic.questions[currentQuiz.questionIndex];
      currentQuestion.answered = true;
    }
    if (isCorrect) {
      setScore(score + currentQuestion.price);
      const dbRef = firebase.database().ref(`rooms/${roomId}/players/${userId}`);
      dbRef.update({
      score: score + currentQuestion.price,
      });
      currentQuestion.correct = true;
      setCurrentPlayerName(playerName);
    } else {
      setScore(score - currentQuestion.price);
      const dbRef = firebase.database().ref(`rooms/${roomId}/players/${userId}`);
      dbRef.update({
      score: score - currentQuestion.price,
      });
      currentQuestion.correct = false;
      let randomPlayerName;
      if(players.length === 1)
      {
        randomPlayerName = playerName;
      }
      else
      {
        const filteredPlayers = players.filter(player => player.name !== currentPlayerName);
        const randomIndex = Math.floor(Math.random() * filteredPlayers.length);
        randomPlayerName = filteredPlayers[randomIndex].name;
      }
      const dbRef2 = firebase.database().ref(`rooms/${roomId}/quizData`);
        dbRef2.set(quizData);
      setCurrentPlayerName(randomPlayerName)
      const dbRef1 = firebase.database().ref(`rooms/${roomId}`);
      dbRef1.update({
      currentPlayerName:randomPlayerName
    });
    }
    setCurrentQuiz(null);
    setQuizData(updatedQuizData);
  };
  
    
  const handlePlayerReady = () => {
    const dbRef = firebase.database().ref(`rooms/${roomId}/players/${userId}`);
    setIsReady(true);
    const playerNameToUpdate = playerName === '' ? userId : playerName;
    setPlayerName(playerNameToUpdate);
    dbRef.update({
    isReady: true,
    name: playerNameToUpdate,
    score: 0
    });
    };
    
    const handlePlayerNotReady = () => {
    const dbRef = firebase.database().ref(`rooms/${roomId}/players/${userId}`);
    dbRef.update({
    isReady: false,
    });
    };
    
    const handlePlayerLeave = () => {
    const dbRef = firebase.database().ref(`rooms/${roomId}/players/${userId}`);
    dbRef.remove();
    
    };
    const handleEndGame = () =>{
      if(gameStarted)
      {
        const dbRef = firebase.database().ref(`rooms/${roomId}`);
        dbRef.update({
          gameEnd: true
        });
        
        quizData.forEach(topic => {
          topic.questions.forEach(question => {
            question.answered = true;
          });
        });
        players && players.forEach((player) => {
          if (player.score > maxScore) {
            setmaxScore(player.score);
            setwinner(player.name);
          }
        });
      }
    };

      return (
        <div>
          <h1>Комната: {roomName}</h1>
          {!gameStarted  &&(
            
          <ul>
                      <h2>Игроки:</h2>
          {players && players.map((player) => (
            <li key={player.id}>
             <h4>{player.name} {player.isReady ? " Готов " : " Не готов "} {" Счёт: " + player.score}</h4> 
            </li>
          ))}
        </ul>)}
          {!gameStarted && (
            <>
             <center> <label>
                <h4>Никнейм: </h4>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </label></center>
              <ul>
                <li><button  className="end-game-button" onClick={handlePlayerReady}>Готов</button></li>
                {isReady && (
                  <li><button  className="end-game-button" onClick={handlePlayerNotReady}>Не готов</button></li>
                )}
                {players.length >= 1 && areAllPlayersReady && (<li><button className="end-game-button" onClick={handleStartGame}>Начать игру</button></li>)}
                <Link to={`/lobby`}><li><button className="end-game-button" onClick={handlePlayerLeave}>Покинуть комнату</button></li></Link>
              </ul>

            </>
          )}
          {gameStarted && (
            
            <div>
              <ul>
                      <h2>Игроки:</h2>
          {players && players.map((player) => (
           <li key={player.id}>
             <h4> {player.name} {" Счёт: " + player.score}</h4>
            </li>
              ))}
            </ul>
              {!gameEnd && (<center><h2>Cейчас очередь игрока: </h2> <h4>{currentPlayerName}</h4></center>)}
              {playerName === currentPlayerName && !gameEnd && (<center><h4>Осталось времени:  {lobbytimeLeft}</h4></center>)}
              {!currentQuiz && (
                <div>
                  <ul>
                    {quizData && quizData.map((topic, topicIndex) => (
                      <li key={topicIndex}>
                        <h2>{topic.title}</h2>
                        <ul className="inner">
                          {topic.questions.map((question, questionIndex) => (
                            <li key={questionIndex} className="inner">
                              {playerName === currentPlayerName  &&  (
                                
                      question.answered ? (
                        
                        <button className="answer" disabled>
                          {question.answered.text}
                        </button>
                      ) : (
                        <button className="price" onClick={() => handleQuizClick(topicIndex, questionIndex)}>
                          {question.price}
                        </button>
                      )
                    )}
                    {playerName !== currentPlayerName && (
                      <button className="price" disabled>
                        {question.price}
                      </button>
                    )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  <center><h2>Ваш счёт: {score}</h2></center>
                  <button className="end-game-button"  onClick={handleEndGame}>Закончить игру</button>
                </div>
              )}
              {currentQuiz && (
                <div>
                  <h1>{currentQuiz.question}</h1>
                  {timeLeft !== 0 ? (
                    <h3>Осталось времени: {timeLeft}</h3>
                  ) : (
                    <h3>Время вышло!</h3>
                  )}
                  <ul>
                    {currentQuiz.answers.map((answer, answerIndex) => (
                      <li key={answerIndex}>
                        <button onClick={() => handleAnswerClick(answer.isCorrect)} disabled={timeLeft === 0}>
                          {answer.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {quizData &&  (quizData.every(topic => topic.questions.every(question => question.answered)) || gameEnd) && (
                
                <div>
                  {handleEndGame()}
                  <center><h4>Игра окончена!</h4></center>
                  <center><h3>Победитель:</h3></center>
                  <center><h4>Никнейм: {winner}</h4></center>
                  <center><h4>Очки: {maxScore}</h4></center>
                  <Link to={`/lobby`}><button className="end-game-button" >Выйти</button></Link>
                </div>
              )}
            </div>
          )}
        </div>
      );
    
      
      };
      
      export default Room;