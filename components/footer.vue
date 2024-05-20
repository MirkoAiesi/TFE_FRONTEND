<template>
  <footer id="picassoFooter">
    <div class="footer-navigation">
      <h3>Lien rapide</h3>
      <ul>
        <li>
          <NuxtLink to="/">Accueil</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/">Rechercher</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/">Mes réservation</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/">Mon compte</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="footer-contact">
      <h3>Nous contacter</h3>
      <p>Email: info@example.com</p>
      <p>
        <NuxtLink to="/" class="support">Support</NuxtLink>
      </p>
    </div>
    <div class="footer-social">
      <h3>Suivez nous sur</h3>
      <div class="social-icons">
        <a href="https://facebook.com" target="_blank" class="social-icon"
          >FB</a
        >
        <a href="https://twitter.com" target="_blank" class="social-icon">TW</a>
        <a href="https://instagram.com" target="_blank" class="social-icon"
          >IG</a
        >
      </div>
    </div>
    <div class="footer-art"></div>
  </footer>
</template>
<script>
export default {
  name: "FooterGroup",
};
</script>
<style>
#picassoFooter {
  background-image: linear-gradient(
    to left top,
    #52682d,
    #5c7533,
    #678239,
    #718f3f,
    #7c9d45
  );
  color: #ffffff;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.footer-navigation,
.footer-contact,
.footer-social {
  margin: 10px;
}

.footer-navigation h3,
.footer-contact h3,
.footer-social h3 {
  color: #f0f0f0;
  margin-bottom: 15px;
}

.footer-navigation ul,
.footer-social .social-icons,
.footer-contact p {
  list-style: none;
  padding: 0;
}
.support {
  list-style: none;
  padding: 0;
  color: #f0f0f0;
  text-decoration: none;
}
.footer-navigation ul li,
.social-icon {
  margin-bottom: 10px;
  transition: transform 0.2s ease-in-out;
}

.footer-navigation ul li a,
.social-icon {
  color: #ffffff;
  text-decoration: none;
}

.social-icon {
  display: inline-block;
  padding: 8px;
  background-color: #445626;
  margin-right: 5px;
}

.social-icon:hover,
.footer-navigation ul li a:hover {
  transform: scale(1.1);
}

.footer-art canvas {
  max-width: 100px;
  height: auto;
  margin-top: 20px;
}

@media (max-width: 600px) {
  #picassoFooter {
    flex-direction: column;
    align-items: center;
  }

  .footer-art canvas {
    max-width: 100%;
  }
}
</style>
