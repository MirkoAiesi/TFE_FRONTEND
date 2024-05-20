<script setup>
import { ref, onMounted } from "vue";
import { modifyUserProfile, modifyUserPassword, fetchUserInfo } from "../services/userService"; // Assurez-vous que ce chemin est correct
import eventBus from '../services/eventBus'; // Importez l'EventBus

const firstName = ref('');
const lastName = ref('');
const email = ref('');

const loadUserInfo = async () => {
    try {
        const data = await fetchUserInfo();
        console.log('Fetched user info:', data);
        firstName.value = data.firstName;
        lastName.value = data.lastName;
        email.value = data.email;
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
};

const updateProfile = async () => {
    console.log('updateProfile called');
    try {
        await modifyUserProfile(firstName.value, lastName.value);
        console.log('Profile updated successfully');
        await loadUserInfo(); // Recharger les infos de l'utilisateur pour mettre à jour l'affichage
        eventBus.updatedProfile = { firstName: firstName.value, lastName: lastName.value }; // Émettre l'événement
    } catch (error) {
        console.error('Failed to update profile:', error);
    }
};
const updatePassword = async () => {
    console.log('updatePassword called');
    try {
        await modifyUserPassword(currentPassword.value, newPassword.value, confirmPassword.value);
        console.log('Password updated successfully');
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (error) {
        console.error('Failed to update password:', error);
    }
};
onMounted(() => {
    loadUserInfo();
});
</script>
<template>
    <div class="container orders">
        <h3>Paramètres</h3>
        <form @submit.prevent="updateProfile">
            <div>
                <div>
                    <label for="firstname">Prénom</label>
                    <input type="text" v-model="firstName" name="firstname" id="firstname" />
                </div>
                <div>
                    <label for="lastname">Nom</label>
                    <input type="text" v-model="lastName" name="lastname" id="lastname" />
                </div>
            </div>
            <label for="email">Adresse mail</label>
            <input type="text" v-model="email" name="email" id="email" disabled />
            <el-button size="large" class="paramsButton" type="primary" round
                @click="updateProfile">Modifier</el-button>
        </form>
        <el-divider />
         <form @submit.prevent="updatePassword" class="passwordParams">
            <h3>Sécurité</h3>
            <div>
                <div>
                    <label for="password">Mot de passe actuel</label>
                    <input type="password" v-model="currentPassword" name="password" id="password" />
                </div>
                <div>
                    <label for="newPassword">Nouveau mot de passe</label>
                    <input type="password" v-model="newPassword" name="newPassword" id="newPassword" />
                </div>
                <div>
                    <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
                    <input type="password" v-model="confirmPassword" name="confirmPassword" id="confirmPassword" />
                </div>
            </div>
            <el-button size="large" class="paramsButton" type="primary" round>Modifier</el-button>
        </form>
        <el-divider />
        <div class="paramsOptions">
            <el-button size="large" class="paramsButton" type="danger" round>Supprimer le compte</el-button>
        </div>
    </div>
</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

form div {
    display: flex;
    margin: 10px;
    justify-content: space-between;
}

form div div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

form div div input {
    font-size: 14px;
}

form input {
    padding: 5px;
    border: 1px solid gray;
    border-radius: 4px;
    font-size: 14px;
}

.paramsButton {
    margin-top: 20px;
    width: fit-content;
}

.paramsOptions {
    display: flex;
    justify-content: space-between;
}
</style>