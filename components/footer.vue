<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: "FooterGroup",
  setup() {
    const dialogVisible = ref(false);

    const popup = () => {
      dialogVisible.value = true;
    };

    const confirmDialog = () => {
      dialogVisible.value = false;
    };

    const cancelDialog = () => {
      dialogVisible.value = false;
    };

    return {
      dialogVisible,
      popup,
      confirmDialog,
      cancelDialog
    };
  }
});
</script>
<template>
  <footer id="picassoFooter">
    <div class="footer-navigation">
      <h3>Lien rapide</h3>
      <ul>
        <li>
          <NuxtLink to="/">Accueil</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/search">Rechercher</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profil">Mes réservation</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profil">Mon compte</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="footer-contact">
      <h3>Nous contacter</h3>
      <p>Email: info@example.com</p>
      <p class="highlight-label" @click="popup">CGV / CGU</p>
      <p>
        <NuxtLink to="/support" class="support">Support</NuxtLink>
      </p>
    </div>
    <div class="footer-social">
      <h3>Suivez nous sur</h3>
      <div class="social-icons">
        <NuxtLink to="../search"><img src="/public/pictures/facebook.png" alt="facebook"
            style="width: 30px; margin:10px;">
        </NuxtLink>
        <NuxtLink to="../search"><img src="/public/pictures/instagram.png" alt="instagram"
            style="width: 30px; margin:10px;">
        </NuxtLink>
      </div>
    </div>
    <div class="footer-art"></div>
  </footer>
  <el-dialog v-model="dialogVisible" title="Informations CGV / CGU" width="60%">
    <div>
      <h3>Introduction</h3>
      <p>Nous vous remercions de l'intérêt que vous portez à notre site web de réservation de tables. La protection de
        vos données personnelles est une priorité pour nous. Cette charte explique comment nous collectons, utilisons,
        stockons et protégeons vos informations personnelles, conformément au Règlement Général sur la Protection des
        Données (RGPD).</p>
      <h3>1. Collecte des Données Personnelles</h3>
      <p>Lors de la création de votre compte utilisateur, nous collectons les informations suivantes :</p>
      <p>Nom</p>
      <p>Prénom</p>
      <p>Adresse email</p>
      <p>Mot de passe</p>
      <h3>2. Utilisation des Données</h3>
      <p>Les données collectées sont utilisées pour les finalités suivantes :</p>
      <p>Création et gestion de votre compte utilisateur</p>
      <p>Réservation de tables dans les restaurants partenaires</p>
      <p>Communication avec vous concernant vos réservations et notre service</p>
      <h3>3. Base Légale du Traitement</h3>
      <p>Le traitement de vos données personnelles repose sur les bases légales suivantes :</p>
      <p>Exécution d'un contrat (pour la gestion de votre compte et la réservation de tables)</p>
      <p>Consentement (pour l'utilisation de vos données à des fins de communication)</p>
      <h3>4. Stockage des Données</h3>
      <p>Vos données personnelles sont stockées de manière sécurisée et ne sont accessibles qu'aux personnes autorisées.
        Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre toute perte,
        accès non autorisé ou divulgation.</p>
      <h3>5. Durée de Conservation</h3>
      <p>Vos données personnelles sont conservées aussi longtemps que votre compte est actif. En cas de suppression de
        votre compte, vos données seront supprimées dans un délai de 30 jours, sauf si une obligation légale nous impose
        de les conserver plus longtemps.</p>
      <h3>6. Droits des Utilisateurs</h3>
      <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
      <p>Droit d'accès : vous pouvez demander à consulter les données que nous détenons sur vous.</p>
      <p>Droit de rectification : vous pouvez demander la correction de vos données personnelles si elles sont
        incorrectes ou incomplètes.</p>
      <p>Droit à l'effacement : vous pouvez demander la suppression de vos données personnelles.</p>
      <p>Droit à la limitation du traitement : vous pouvez demander la limitation du traitement de vos données
        personnelles.</p>
      <p>Droit à la portabilité : vous pouvez demander à recevoir vos données personnelles dans un format structuré et
        couramment utilisé.</p>
      <p>Droit d'opposition : vous pouvez vous opposer au traitement de vos données personnelles dans certaines
        circonstances.</p>
      <p>Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <a
          href="mailto:[adresse email de contact]">[adresse email de contact]</a>.</p>
      <h3>7. Sécurité des Données</h3>
      <p>Nous prenons la sécurité de vos données très au sérieux et utilisons des protocoles de sécurité avancés pour
        protéger vos informations personnelles. Nos systèmes sont régulièrement mis à jour pour prévenir les failles de
        sécurité.</p>
      <h3>8. Modifications de la Charte</h3>
      <p>Nous nous réservons le droit de modifier cette charte à tout moment. Toute modification sera publiée sur cette
        page et, si les changements sont significatifs, nous vous en informerons par email.</p>
      <h3>9. Contact</h3>
      <p>Pour toute question ou préoccupation concernant cette charte ou la manière dont nous traitons vos données
        personnelles, veuillez nous contacter à : [adresse email de contact].</p>
      <h3>Conclusion</h3>
      <p>Nous nous engageons à protéger vos données personnelles et à respecter vos droits en matière de protection des
        données. En utilisant notre site web et en créant un compte utilisateur, vous acceptez les termes de cette
        charte RGPD.</p>
      <p>Merci pour votre confiance.</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmDialog">ok</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
#picassoFooter {
  background-image: linear-gradient(to left top,
      #52682d,
      #5c7533,
      #678239,
      #718f3f,
      #7c9d45);
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

.highlight-label {
  text-decoration: underline;
  padding: 5px;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.highlight-label:hover {
  background-color: lightyellow;
  cursor: pointer;

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
