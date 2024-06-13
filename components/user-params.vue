<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { modifyUserProfile, modifyUserPassword, fetchUserInfo, deleteAccount } from '../services/userService';
import eventBus from '../services/eventBus';
import { ElMessage } from 'element-plus';

const firstName = ref('');
const lastName = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const loadUserInfo = async () => {
    try {
        const data = await fetchUserInfo();
        console.log('Fetched user info:', data);
        firstName.value = data.firstName;
        lastName.value = data.lastName;
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
};

const updateProfile = async () => {
    console.log('updateProfile called');
    try {
        await modifyUserProfile(firstName.value, lastName.value);
        console.log('Profile updated successfully');
        await loadUserInfo();
        eventBus.updatedProfile = { firstName: firstName.value, lastName: lastName.value };
    } catch (error) {
        console.error('Failed to update profile:', error);
    }
};

const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const updatePassword = async () => {
    console.log('updatePassword called');
    if (!isValidPassword(newPassword.value)) {
        ElMessage({
            type: 'error',
            showClose: true,
            grouping: true,
            message: 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial.',
        });
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        ElMessage({
            type: 'error',
            showClose: true,
            grouping: true,
            message: 'Le nouveau mot de passe et la confirmation ne correspondent pas.',
        });
        return;
    }
    try {
        await modifyUserPassword(currentPassword.value, newPassword.value, confirmPassword.value);
        console.log('Password updated successfully');
        ElMessage({
            type: 'success',
            message: 'Mot de passe modifié avec succès.',
        });
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (error) {
        console.error('Failed to update password:', error);
        ElMessage({
            type: 'error',
            showClose: true,
            grouping: true,
            message: 'Échec de la mise à jour du mot de passe. Vérifiez votre mot de passe actuel.',
        });
    }
};

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]*$/;

watch(firstName, (newValue, oldValue) => {
    if (!nameRegex.test(newValue)) {
        firstName.value = oldValue;
        nextTick(() => {
            ElMessage({
                type: 'error',
                showClose: true,
                grouping: true,
                message: 'Veuillez rentrer des caractères valides.',
            });
        });
    }
});

watch(lastName, (newValue, oldValue) => {
    if (!nameRegex.test(newValue)) {
        lastName.value = oldValue;
        nextTick(() => {
            ElMessage({
                type: 'error',
                showClose: true,
                grouping: true,
                message: 'Veuillez rentrer des caractères valides.',
            });
        });
    }
});
const handleDeleteAccount = async () => {
    try {
        const confirmation = confirm('Etes-vous sûr de supprimer votre compte ? Cette action est irréversible.');
        if (confirmation) {
            const response = await deleteAccount();
            console.log(response);
            alert('Compte supprimé');
            navigateTo('/');
        }
    } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Erreur lors de la suppression du compte');
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
            <el-button size="large" class="paramsButton" type="primary" round
                @click="updatePassword">Modifier</el-button>
        </form>
        <el-divider />
        <div class="paramsOptions">
            <el-button size="large" class="paramsButton" type="danger" round @click="handleDeleteAccount">Supprimer le
                compte</el-button>
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

@media (max-width: 868px) {
    .orders h3 {
        font-size: 16px;
    }

    form div {
        flex-direction: column;
    }

    form label {
        font-size: 14px;
    }

    .paramsButton {
        width: 40%;
        font-size: 10px;
    }
}
</style>