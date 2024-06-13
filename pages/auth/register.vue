<script setup lang="ts">
import { parseISO, differenceInYears } from "date-fns";
import { ElMessage } from "element-plus";
import { addUser } from "../../services/userService";

const state = reactive({
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  password: '',
  confirm: '',
  birthday: undefined,
  condition: false,
});

function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function onSubmit() {
  if (!state.birthday) {
    console.log("La date de naissance n'est pas renseignée.");
    return;
  }
  const birthdayDate = parseISO(state.birthday);
  const age = differenceInYears(new Date(), birthdayDate);
  if (age < 16) {
    ElMessage({
      type: "error",
      showClose: true,
      grouping: true,
      message: "Vous devez avoir plus de 16 ans pour vous inscrire.",
    });
    return;
  }
  if (state.password !== state.confirm) {
    ElMessage({
      type: "error",
      showClose: true,
      grouping: true,
      message: "Les mots de passes sont différents.",
    });
    return;
  }
  if (!isValidPassword(state.password)) {
    ElMessage({
      type: "error",
      showClose: true,
      grouping: true,
      message: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial.",
    });
    return;
  }
  if (state.condition === false) {
    ElMessage({
      type: "error",
      showClose: true,
      grouping: true,
      message: "Merci d'accepter les CGU / CGV.",
    });
    return;
  }
  const response = await addUser(state);
  if (response === true) {
    ElMessage({
      type: "success",
      message: "Inscription réussite.",
    });
    await navigateTo("/auth/login");
  } else {
    ElMessage({
      type: "error",
      showClose: true,
      message: "Une erreur est survenue durant l'inscription",
    });
  }
}
const dialogVisible = ref(false)

const popup = () => {

  dialogVisible.value = true

};
const confirmDialog = () => {
  state.condition = true;
  dialogVisible.value = false;
};
const cancelDialog = () => {
  dialogVisible.value = false;
  state.condition = false;
};
</script>

<template>
  <div class="register-page">
    <div class="register-text">
      <h2>INSCRIPTION</h2>
      <h3>
        Afin de profiter de toutes les fonctionnalités de BetterRestaurant, merci de créer un compte.
      </h3>
      <NuxtLink to="../auth/login">
        <p>Vous avez un compte ? Cliquez ici</p>
      </NuxtLink>
    </div>
    <div class="register-container">
      <form @submit.prevent="onSubmit">
        <div class="form-container">
          <div>
            <label for="last_name">Nom</label>
            <input required type="text" name="last_name" id="last_name" v-model="state.last_name" />
          </div>
          <div>
            <label for="first_name">Prénom</label>
            <input required type="text" name="first_name" id="first_name" v-model="state.first_name" />
          </div>
        </div>
        <div class="register-mail">
          <label for="email">Adresse mail</label>
          <input required type="email" name="email" id="email" v-model="state.email" />
        </div>
        <div class="form-container">
          <div>
            <label for="password">Mot de passe</label>
            <input required type="password" name="password" id="password" v-model="state.password" />
          </div>
          <div>
            <label for="confirm">Confirmer</label>
            <input required type="password" name="confirm" id="confirm" v-model="state.confirm" />
          </div>
        </div>
        <div class="form-container">
          <div>
            <label for="birthday">Date de naissance</label>
            <input required type="date" name="birthday" id="birthday" v-model="state.birthday" />
          </div>
          <div class="register-condition">
            <label class="highlight-label" @click="popup()">CGV / CGU</label>
            <input type="checkbox" name="condition" id="condition" v-model="state.condition" />
          </div>
        </div>
        <div class="register-button">
          <button class="submitButton" type="submit">Inscription</button>
        </div>
      </form>
      <img src="../../public/pictures/auth/auth.svg" alt="" />
    </div>
    <el-dialog v-model="dialogVisible" title="Informations CGV /  CGU" width="600">
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
        <p>Date d'anniversaire</p>


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
        <p>Vos données personnelles sont stockées de manière sécurisée et ne sont accessibles qu'aux personnes
          autorisées. Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données
          contre toute perte, accès non autorisé ou divulgation.</p>

        <h3>5. Durée de Conservation</h3>
        <p>Vos données personnelles sont conservées aussi longtemps que votre compte est actif. En cas de suppression de
          votre compte, vos données seront supprimées dans un délai de 30 jours, sauf si une obligation légale nous
          impose de les conserver plus longtemps.</p>

        <h3>6. Droits des Utilisateurs</h3>
        <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>

        <p>Droit d'accès : vous pouvez demander à consulter les données que nous détenons sur vous.</p>
        <p>Droit de rectification : vous pouvez demander la correction de vos données personnelles si elles sont
          incorrectes ou incomplètes.</p>
        <p>Droit à l'effacement : vous pouvez demander la suppression de vos données personnelles.</p>
        <p>Droit à la limitation du traitement : vous pouvez demander la limitation du traitement de vos données
          personnelles.</p>
        <p>Droit à la portabilité : vous pouvez demander à recevoir vos données personnelles dans un format structuré
          et couramment utilisé.</p>
        <p>Droit d'opposition : vous pouvez vous opposer au traitement de vos données personnelles dans certaines
          circonstances.</p>

        <p>Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <a
            href="mailto:[adresse email de contact]">[adresse email de contact]</a>.</p>

        <h3>7. Sécurité des Données</h3>
        <p>Nous prenons la sécurité de vos données très au sérieux et utilisons des protocoles de sécurité avancés pour
          protéger vos informations personnelles. Nos systèmes sont régulièrement mis à jour pour prévenir les failles
          de sécurité.</p>

        <h3>8. Modifications de la Charte</h3>
        <p>Nous nous réservons le droit de modifier cette charte à tout moment. Toute modification sera publiée sur
          cette page et, si les changements sont significatifs, nous vous en informerons par email.</p>
        <h3>9. Contact</h3>
        <p>
          Pour toute question ou préoccupation concernant cette charte ou la manière dont nous traitons vos données
          personnelles, veuillez nous contacter à : [adresse email de contact].
        </p>

        <h3>Conclusion</h3>
        <p>
          Nous nous engageons à protéger vos données personnelles et à respecter vos droits en matière de protection des
          données. En utilisant notre site web et en créant un compte utilisateur, vous acceptez les termes de cette
          charte RGPD.
        </p>

        <p>Merci pour votre confiance.</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click=cancelDialog>refuser</el-button>
          <el-button type="primary" @click="confirmDialog">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 50px 0;
}

.register-text {
  text-align: center;
  margin-bottom: 40px;
}

.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.register-container img {
  width: 40%;
}

.register-container form label {
  font-size: 14px;
}

.register-container form input {
  width: 100%;
  padding: 1px 4px;
  border-radius: 4px;
  border: 3px solid #7c9d45;
  outline: none;
  font-size: 15px;
}

.register-container form input:focus {
  border: 3px solid #52682d;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
}

.form-container div {
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: 10px;
}

.register-mail {
  margin: 0 10px 10px 10px;
}

.form-container .register-condition {
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: end;
}

.register-container form .register-condition input {
  width: 15px;
  height: 15px;
  margin-left: 10px;
  margin-bottom: 2px;
  accent-color: #6e8b3d;
  cursor: pointer;
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

.register-button {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.register-button button {
  padding: 8px 13px;
  font-size: 16px;
  background-color: #7c9d45;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  color: white;
}

.register-button button:hover {
  background-color: #6e8b3d;
}

@media (max-width: 440px) {
  .form-container {
    justify-content: center;
  }

  .register-mail {
    width: 200px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .register-container img {
    display: none;
  }

  .register-condition {
    justify-content: center;
  }
}
</style>
