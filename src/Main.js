import { Link } from 'react-router-dom';
import {firebase} from './firebase';

const script = document.addEventListener('DOMContentLoaded', function() {
  
  const loginLink = document.getElementById('login-item');
  const logoutLink = document.getElementById('logout-item');
  const registerLink = document.getElementById('register-item');
  const userEmailLink = null;
  firebase.auth().onAuthStateChanged((user) => {
    
  if (user) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'block'; 
    registerLink.style.display = 'none';
    const userEmail = user.email;
    const userEmailLink = document.getElementById('user-item');
    const emailLink = document.getElementById('user-link-email');
    emailLink.innerText = userEmail;
    userEmailLink.style.display = 'block';
  } else {
    loginLink.style.display = 'block';
    registerLink.style.display ='block';
    logoutLink.style.display = 'none';
    userEmailLink.style.display = 'none'; 
    window.location.reload();
  }
  });
  logoutLink.addEventListener('click', (event) => {
  event.preventDefault();
  firebase.auth().signOut();
  window.location.reload();
  });
  });;
const Main = () => {
  return (
    <div className="header-top">
      <section className="slider-section">
        <div className="banner-main">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="text-img">
                  <figure>
                    <img src="images/img.png" alt="Illustration of a person using a laptop" />
                  </figure>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="text-bg">
                  <h1>Увлекательная викторина</h1>
                  <p>Отправляйтесь в путешествие в мир знаний с игрой викторину и получите незабываемый опыт, испытав свои знания на предмет всего, от спорта до политики.</p>       
                  <Link to="/game" className="end-game-button">
                    Играть
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: `<script>${script}</script>` }} />
    </div>
    
  );
};

export default Main;