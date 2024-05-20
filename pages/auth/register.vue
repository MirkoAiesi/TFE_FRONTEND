<script setup lang="ts">
import { parseISO, differenceInYears } from "date-fns";
import { ElMessage } from "element-plus";
import { addUser } from "../../services/userService";
const state = reactive({
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  password: undefined,
  confirm: undefined,
  birthday: undefined,
  condition: false,
});

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
</script>

<template>
  <div class="register-page">
    <div class="register-text">
      <h2>INSCRIPTION</h2>
      <h3>
        Afin de profiter de toute les fonctionnalités de BetterRestaurant merci
        de créer un compte.
      </h3>
      <NuxtLink to="../auth/login">
        <p>Vous avez un compte cliqué ici</p>
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
            <label for="codition">CGV / CGU</label>
            <input required type="checkbox" name="condition" id="condition" v-model="state.condition" />
          </div>
        </div>
        <div class="register-button">
          <button class="submitButton" type="submit">Inscription</button>
        </div>
      </form>
      <img src="../../public/pictures/auth/auth.svg" alt="" />
    </div>
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
