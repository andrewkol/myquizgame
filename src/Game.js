import React, { useState, useEffect, useRef } from 'react';
import { firebase,auth } from './firebase';
import { Link} from 'react-router-dom';

const Game = () => {
  const [quizData, setQuizData] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const intervalRef = useRef();

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
  }, []);
  

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

  useEffect(() => {
    if (timeLeft === 0 && currentQuiz) {
      handleAnswerClick(false);
    }
  }, [timeLeft, currentQuiz]);

  const handleQuizClick = (topicIndex, questionIndex) => {
    const selectedQuiz = quizData[topicIndex].questions[questionIndex];
    if (selectedQuiz.answered) {
      return;
    }
    clearInterval(intervalRef.current);
    setTimeLeft(10);
    setCurrentQuiz({ ...selectedQuiz, topicIndex, questionIndex });
  };

  const handleAnswerClick = (isCorrect) => {
    clearInterval(intervalRef.current);
    const updatedQuizData = [...quizData];
    const currentTopic = updatedQuizData[currentQuiz.topicIndex];
    const currentQuestion = currentTopic.questions[currentQuiz.questionIndex];
    currentQuestion.answered = true;
    if (isCorrect) {
      setScore(score + currentQuestion.price);
      currentQuestion.correct = true;
    } else {
      setScore(score - currentQuestion.price);
      currentQuestion.correct = false;
    }
    setCurrentQuiz(null);
    setQuizData(updatedQuizData);
  };

  const handleStartClick = () => {
    setGameStarted(true);
  };
  const handleEndGame = () => {
    const user = { user: auth.currentUser.email, score: score, timestamp: new Date() };
  
    firebase.firestore().collection('top-scores').get().then((querySnapshot) => {
      let foundDoc = false;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.user === user.user) {
          foundDoc = true;
          if (data.score < user.score) {
            doc.ref.update({ score: user.score, timestamp: user.timestamp });
          }
        }
      });
  
      if (!foundDoc) {
        firebase.firestore().collection('top-scores').add(user);
      }
    });
  }
  if(auth.currentUser === null)
    {
      return(
        <center><h4><Link to={`/login`}>Войдите</Link>, для продолжения.</h4></center>
      )
    }

  if (!gameStarted) {
    return (
      <div>
        <center><h2>Для начала игры: </h2></center>
        <center><button className="form-button" onClick={handleStartClick}>Начать игру</button></center>
      </div>
    );
  }

  return (
    <div>
      {!currentQuiz && (
        <div>
        <ul>
          {quizData.map((topic, topicIndex) => (
            <li key={topicIndex}>
              <h2>{topic.title}</h2>
              <ul className="inner">
                {topic.questions.map((question, questionIndex) => (
                  <li key={questionIndex} className="inner">
                    {question.answered ? (
                      <button className="answer" disabled>
                        {question.answered.text}
                      </button>
                    ) : (
                      <button className="price" onClick={() => handleQuizClick(topicIndex, questionIndex)}>
                        {question.price}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <h2>Счет: {score}</h2>
      </div>
      
      )}
      {currentQuiz && (
        <div>
          <h1>{currentQuiz.question}</h1>
          {timeLeft !== 0 ? (
            <h4>Осталось времени: {timeLeft}</h4>
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
      {quizData.every(topic => topic.questions.every(question => question.answered)) && (
        <div>
          <center><h1>Игра окончена</h1></center>
          <center><h2>Финальный счет: {score}</h2></center>
          <center><Link to={`/main`}><button onClick={handleEndGame}>Закончить игру</button></Link></center>
        </div>
      )}
    </div>
  );  
};
export default Game;