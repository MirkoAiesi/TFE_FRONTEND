<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

const lastName = ref('');
const firstName = ref('');
const email = ref('');
const issueType = ref('');
const mailTitle = ref('');
const mailDetails = ref('');

const issueOptions = [
    { value: 'reservation', label: 'Problème de réservation' },
    { value: 'login', label: 'Problème de connexion' },
    { value: 'payment', label: 'Problème de paiement' },
    { value: 'cancellation', label: 'Problème d\'annulation' },
    { value: 'other', label: 'Autre' },
];

const sendSupportRequest = () => {
    if (!lastName.value || !firstName.value || !email.value || !issueType.value || !mailTitle.value || !mailDetails.value) {
        ElMessage({
            type: 'error',
            message: 'Veuillez remplir tous les champs du formulaire.',
        });
        return;
    }

    const subject = encodeURIComponent(mailTitle.value);
    const body = encodeURIComponent(`Nom: ${lastName.value}\nPrénom: ${firstName.value}\nEmail: ${email.value}\nType de Problème: ${issueType.value}\n\nDétails:\n${mailDetails.value}`);
    const mailtoLink = `mailto:support@BR.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    ElMessage({
        type: 'success',
        message: 'Votre demande de support a été envoyée avec succès.',
    });

    lastName.value = '';
    firstName.value = '';
    email.value = '';
    issueType.value = '';
    mailTitle.value = '';
    mailDetails.value = '';
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

const emailRegex = /^[a-zA-Z0-9@._-]*$/;

watch(email, (newValue, oldValue) => {
    if (!emailRegex.test(newValue)) {
        email.value = oldValue;
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
</script>

<template>
    <div class="support-container">
        <h2>Contactez le Support</h2>
        <form @submit.prevent="sendSupportRequest">
            <div class="form-group">
                <label for="name">Nom</label>
                <input type="text" v-model="lastName" id="name" required />
            </div>
            <div class="form-group">
                <label for="firstName">Prénom</label>
                <input type="text" v-model="firstName" id="firstName" required />
            </div>
            <div class="form-group">
                <label for="email">Adresse Email</label>
                <input type="email" v-model="email" id="email" required />
            </div>
            <div class="form-group">
                <label for="issueType">Type de Problème</label>
                <select v-model="issueType" id="issueType" required>
                    <option value="" disabled>Choisissez un problème</option>
                    <option v-for="option in issueOptions" :key="option.value" :value="option.value">{{ option.label }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="mailTitle">Titre du Mail</label>
                <input type="text" v-model="mailTitle" id="mailTitle" required />
            </div>
            <div class="form-group">
                <label for="mailDetails">Détails de l'erreur rencontrée</label>
                <textarea v-model="mailDetails" id="mailDetails" rows="5" required></textarea>
            </div>
            <div class="form-group button-group">
                <el-button @click="sendSupportRequest" type="primary" round>envoyer</el-button>
            </div>
        </form>
    </div>
</template>
<style scoped>
.support-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    margin-bottom: 20px;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    margin-bottom: 5px;
    font-weight: bold;
}

input,
select,
textarea {
    width: calc(100% - 40px);
    padding: 10px;
    margin: 0 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    resize: none;
}

.form-group.button-group {
    display: flex;
    justify-content: center;
}
</style>
