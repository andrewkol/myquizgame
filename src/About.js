import { Link} from 'react-router-dom';

function About() {
  return (
    <div>
      <h1>Игра-викторина</h1>
      <p>Игра-викторина - это увлекательная и интеллектуальная игра, в которой игроки отвечают на вопросы различной сложности из разных областей знаний. Эта игра может быть использована как развлекательная программа на вечеринке, школьном мероприятии или корпоративном мероприятии.</p>
      <h2>Проект игры-викторины</h2>
      <p>Проект игры-викторины, представляет собой интерактивную игру, которая может использоваться как для развлечения, так и для обучения. Игроки могут выбрать режим игры и попробовать ответить на вопросы. Оценка ответов происходит автоматически, что делает игру удобной и простой в использовании.</p>
      <h3>Контакты</h3>
      <p>Для связи с Колачем Андреем и получения дополнительной информации о проекте игры-викторины, вы можете отправить сообщение через раздел <Link to={`/appeal`}>"Контакты"</Link>, либо отправить ему электронное письмо на адрес: <a href="mailto:kai.20@uni-dubna.ru">kai.20@uni-dubna.ru</a>. Он всегда готов обсудить свои идеи и помочь в реализации любых проектов, связанных с научными исследованиями или программированием.</p>
    </div>
  );
}

export default About;