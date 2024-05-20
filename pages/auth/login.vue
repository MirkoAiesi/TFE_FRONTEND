<script setup>
import { ElMessage } from "element-plus";
import { login } from "../../services/userService";
const user = ref({
  email: '',
  password: ''
})

const onSubmit = async () => {
  try {
    if (user.email !== "" && user.password !== "") {
      await login(user.value);
      ElMessage({
        message: 'Connexion réussite !',
        type: "success",
        grouping: true,
        showClose: true
      })
      await navigateTo('/');
    } else {
      ElMessage({
        message: "Merci de rentrer toute les informations requises.",
        type: "error",
        grouping: true,
        showClose: true
      })
    }
  } catch (e) {
    ElMessage({
      message: e,
      type: "error",
      grouping: true,
      showClose: true
    })
  }

}
</script>

<template>
  <div class="register-page">
    <div class="register-text">
      <h2>CONNEXION</h2>
      <h3>Quel plaisir de vous revoir !</h3>
      <NuxtLink to="../auth/register">
        <p>Vous n'avez pas de compte cliqué ici</p>
      </NuxtLink>
    </div>
    <div class="register-container">
      <img src="../../public/pictures/auth/auth.svg" alt="" />
      <form @submit.prevent="onSubmit">
        <div class="register-mail">
          <label for="email">Adresse mail</label>
          <br>
          <input required v-model="user.email" type="email" name="email" id="email" />
        </div>
        <div class="form-container">
          <div>
            <label for="password">Mot de passe</label>
            <input required v-model="user.password" type="password" name="password" id="password" />
          </div>
        </div>
        <div class="form-container">
        </div>
        <div class="register-button">
          <button class="submitButton" type="submit">Se connecter</button>
        </div>
      </form>
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
  width: 47%;
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
}
</style>
