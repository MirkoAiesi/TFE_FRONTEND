<template>
  <div>
    <section class="landingPage">
      <div class="landingText">
        <h1>Better Restaurant</h1>
        <h2>Votre table vous attend dès maintenant !</h2>
        <NuxtLink to="../search"><button class="startSearch">Commencer les recherches !</button>
        </NuxtLink>

      </div>
      <div class="landingImage">
        <img src="../public/pictures/landingPage/plateform.png" alt="Landing Image" />
        <img src="../public/pictures/landingPage/shadow.png" class="shadow" alt="Landing Image" />
        <img src="../public/pictures/landingPage/phone.png" class="phone" alt="Landing Image" />
        <img src="../public/pictures/landingPage/glass.png" class="glass" alt="Landing Image" />
        <img src="../public/pictures/landingPage/purplePlant.png" class="plant" alt="Landing Image" />
      </div>
    </section>
    <section class="explain">
      <h2>Comment ça fonctionne ?</h2>
      <div class="explainContainer">
        <div class="bentoContainer">
          <h2>Trouver le restaurant parfait</h2>
          <p>
            Explorez notre sélection de restaurants triés sur le volet, offrant
            une variété de cuisines pour satisfaire tous les goûts. Utilisez nos
            filtres avancés pour trouver l'endroit idéal, qu'il s'agisse d'un
            restaurant étoilé, d'une brasserie cosy ou d'un bistrot de quartier.
            Trouvez votre prochaine expérience gastronomique mémorable avec
            facilité.
          </p>
        </div>
        <div id="delayShadow" class="bentoContainer reverse">
          <h2>Réserver en toute simplicité</h2>
          <p>
            Une fois que vous avez trouvé le lieu idéal, réservez votre table en
            quelques clics. Choisissez la date et l'heure qui vous conviennent,
            et ajoutez des détails spéciaux comme des demandes alimentaires
            particulières ou des notes pour l'équipe du restaurant. Faites de
            votre réservation une expérience personnelle et mémorable.
          </p>
        </div>
        <div class="bentoContainer">
          <h2>Confirmation du restaurateur</h2>
          <p>
            Dès que le restaurateur aura validé votre réservation, vous recevrez
            un mail de confirmation. Préparez-vous à vivre une expérience
            culinaire inoubliable, avec la tranquillité d'esprit que votre table
            vous attend.
          </p>
        </div>
      </div>
    </section>
    <section class="explain">
      <div class="explainContainer">
        <h2>Système de fidélité</h2>
        <div class="bentoContainer">
          <p>Quand vous réservez une table chez un de nos restaurateurs sur BetterRestaurant, vous accumulez des points
            de fidélité échangeables contre des bons de réduction.</p>
          <br>
          <p>Une réservation = 20 points de fidélité</p>
          <p>Un avis sur un restaurant où vous avez mangé = 5 points de fidélité</p>
        </div>
        <div id="delayShadow" class="bentoContainer reverse">
          <p>100 points : 5% de réduction sur la prochaine réservation.</p>
          <p>200 points : 10% de réduction sur la prochaine réservation.</p>
          <p>500 points : 20% de réduction sur la prochaine réservation.</p>
        </div>
      </div>


    </section>
    <section class="callAction">
      <h2>
        Il ne reste qu'une chose à faire, rechercher le restaurant de vos envies
        !
      </h2>
      <NuxtLink to="/search"><button class="startSearch">Commencer les recherches !</button>
      </NuxtLink>
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </section>
    <section class="restorer">
      <div class="restorerContainer"></div>
    </section>
  </div>
</template>

<style scoped>
.landingPage {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  height: 90vh;
  position: relative;
}

.landingText,
.landingImage {
  flex: 1;
}

.landingText {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 15px;
  width: auto;
}

.landingText h1 {
  opacity: 0;
  font-size: 55px;
  font-weight: 500;
  animation: h1Animation 0.5s ease forwards;
}

.landingText h2 {
  opacity: 0;
  font-size: 40px;
  font-weight: 500;
  animation: h2Animation 0.5s ease forwards;
  animation-delay: 0.5s;
}

.startSearch {
  opacity: 0;
  padding: 9px 14px;
  position: relative;
  top: 30px;
  color: white;
  background-color: #6e8b3d;
  border: none;
  border-radius: 25px;
  font-size: 20px;
  cursor: pointer;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 1s;
  scale: 1;
  transition: 0.5s;
}

.startSearch:hover {
  scale: 1.05;
}

.landingImage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}

.landingImage img {
  position: absolute;
  min-width: 480px;
  max-width: 70%;
  height: auto;
  box-shadow: none;
}

.explain {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.explainContainer {
  max-width: 1100px;
  margin: 0 20px;
}

.explain h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: center;
}

.bentoContainer {
  position: relative;
  width: 95%;
  padding: 20px;
  margin: 20px 0;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 8px;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bentoContainer p,
h2 {
  position: relative;
}

.bentoContainer h2 {
  text-align: left;
  font-weight: 500;
  font-size: 26px;
}

.bentoContainer p {
  font-size: 18px;
}

.explainContainer .reverse {
  display: flex;
  flex-direction: column;
  align-items: end;
  text-align: end;
}

.reverse::before {
  display: none;
}

.reverse::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  z-index: 0;
  right: 0;
  bottom: -150px;
  background: #96b85d;
  filter: blur(102px);
  border-radius: 50%;
  animation: moveShadow 3s linear alternate infinite;
}

.bentoContainer::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  z-index: 0;
  left: -100px;
  top: -150px;
  background: #96b85d;
  border-radius: 50%;
  animation: moveShadow 2s linear alternate infinite;
  filter: blur(102px);
}

#delayShadow::before {
  animation-delay: 1s;
}

.callAction {
  background-image: linear-gradient(to right top,
      #52682d,
      #5c7533,
      #678239,
      #718f3f,
      #7c9d45);
  height: 250px;
  margin: 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

.callAction h2 {
  font-size: 32px;
  font-weight: 500;
  color: white;
  text-align: center;
  z-index: 100;
}

.callAction button {
  opacity: 1;
  background-color: #7c9d45;
  animation: none;
  margin-bottom: 25px;
  z-index: 100;
}

.restorer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.restorerContainer {
  max-width: 1100px;
  margin: 0 20px;
}

.shadow {
  animation: shadow 2s ease-in-out infinite alternate;
}

.phone {
  animation: phone 2s ease-in-out infinite alternate;
}

.glass {
  animation: phone 2s ease-in-out infinite alternate;
}

.plant {
  animation: phone 2s ease-in-out infinite alternate;
}

.reward {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

@keyframes shadow {
  0% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1.03);
  }
}

@keyframes phone {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(15px);
  }
}

@keyframes sway {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-5px);
  }
}

@keyframes h1Animation {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes h2Animation {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;

    transform: scale(1);
  }
}

@keyframes moveShadow {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(150px, 100px);
  }
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
}

.circles li:nth-child(1) {
  left: 25%;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.circles li:nth-child(2) {
  left: 10%;
  width: 20px;
  height: 20px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 20px;
  height: 20px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 25px;
  height: 25px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 15px;
  height: 15px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 11s;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}

@media (max-width: 868px) {
  .landingText h1 {
    font-size: 50px;
    font-weight: 500;
  }

  .landingText h2 {
    font-size: 30px;
    font-weight: 500;
  }

  .landingImage {
    display: none;
  }

  .explain {
    width: 95%;
  }

  .callAction h2 {
    font-size: 18px;
  }

  .callAction button {
    font-size: 16px;

  }
}
</style>
