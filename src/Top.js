import {firebase } from './firebase';
import React, {useEffect, useState } from 'react';

const Top = () => {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const getTopScores = async () => {
      const scores = [];
      const querySnapshot = await firebase.firestore()
        .collection('top-scores')
        .orderBy('score', 'desc')
        .limit(10)
        .get();

      querySnapshot.forEach((doc) => {
        scores.push({ id: doc.id, ...doc.data() });
      });

      setTopScores(scores);
    };

    getTopScores();
  }, []);

  return (
    <div>
      <center><h2>Топ игроков</h2></center>
      <table>
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Счёт</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((score) => (
            <tr key={score.id}>
              <td>{score.user}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Top;