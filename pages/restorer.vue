<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { definePageMeta } from '#imports';
import { addRestaurant } from '../services/userService'; // Assurez-vous que le chemin est correct

definePageMeta({
    middleware: 'check-restaurant'
});

const dialogVisible = ref(false);

const days = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
const selectedDays = ref([false, false, false, false, false, false, false]);
const openingHours = ref(['', '', '', '', '', '', '']);
const closingHours = ref(['', '', '', '', '', '', '']);

const toggleDay = (index: number) => {
    if (!selectedDays.value[index]) {
        openingHours.value[index] = '';
        closingHours.value[index] = '';
    }
};

const restaurantName = ref('');
const address = ref('');
const phone = ref('');
const cookingType = ref('');
const price = ref('');
const cultery = ref(1);
const rating = ref(0);
const status = ref(10);

const isBreak = ref(false);
const breakTime = ref(['', '']);
const vacancy = ref(false);
const vacancyTime = ref(['', '']);

const hasTerrace = ref(false);
const acceptsDogs = ref(false);
const payments = ref({
    visa: false,
    mastercard: false,
    maestro: false,
});

const restoRegex = /^[a-zA-ZÀ-ÿ0-9\s'-]*$/;

watch(restaurantName, (newValue, oldValue) => {
    if (!restoRegex.test(newValue)) {
        restaurantName.value = oldValue;
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

const addressRegex = /^[a-zA-ZÀ-ÿ0-9\s,'.-]*$/;
watch(address, (newValue, oldValue) => {
    if (!addressRegex.test(newValue)) {
        address.value = oldValue;
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


const phoneRegex = /^\d+$/;

const validateInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    let cleanedValue = input.value.replace(/\D/g, '');
    if (cleanedValue.length > 10) {
        cleanedValue = cleanedValue.slice(0, 10);
    }
    if (phoneRegex.test(cleanedValue) && cleanedValue !== '' && input.value.length >= 11) {
        nextTick(() => {
            ElMessage({
                type: 'error',
                showClose: true,
                grouping: true,
                message: 'Veuillez entrer un numéro de téléphone belge valide (9 à 10 chiffres).',
            });
        });
    }
    phone.value = cleanedValue;
};

interface Schedule {
    [key: string]: [string, string] | ['fermé', 'fermé'];
}

const handleAddRestaurant = async () => {
    const schedule: Schedule = {};
    days.value.forEach((day, index) => {
        schedule[day.toLowerCase()] = selectedDays.value[index]
            ? [openingHours.value[index], closingHours.value[index]]
            : ['fermé', 'fermé'];
    });

    const options = [
        hasTerrace.value ? 'oui' : 'non',
        acceptsDogs.value ? 'oui' : 'non',
        payments.value.visa ? 'visa' : '',
        payments.value.mastercard ? 'mastercard' : '',
        payments.value.maestro ? 'maestro' : '',
    ].filter(Boolean).join(', ');

    const restaurant = {
        name: restaurantName.value,
        address: address.value,
        phone: phone.value,
        status: status.value,
        cooking_type: cookingType.value,
        price: price.value,
        cultery: cultery.value,
        schedule: schedule,
        rating: rating.value,
        cut_time: isBreak.value ? breakTime.value : null,
        vacancy: vacancy.value ? vacancyTime.value : null,
        options: options,
    };

    console.log('Sending restaurant data:', JSON.stringify(restaurant, null, 2));

    try {
        await addRestaurant(restaurant);
        dialogVisible.value = false;
        ElMessage({
            type: 'success',
            showClose: true,
            message: 'Restaurant ajouté avec succès!',
        });
    } catch (error) {
        console.error('Error adding restaurant:', error);
        ElMessage({
            type: 'error',
            showClose: true,
            message: 'Erreur lors de l\'ajout du restaurant.',
        });
    }
};

</script>
<template>
    <div class="button-container">
        <h2>Avez-vous un restaurant ?</h2>
        <el-button plain @click="dialogVisible = true" class="button">Cliquez ici pour vous créer une page</el-button>
        <el-dialog v-model="dialogVisible" title="Création de votre page" width="500">
            <div class="register-container">
                <form>
                    <div class="register-address">
                        <div>
                            <label for="restaurantName">Restaurant</label>
                            <input type="text" v-model="restaurantName" name="restaurantName" id="restaurantName" />
                        </div>
                    </div>
                    <div class="register-address">
                        <label for="address">Adresse</label>
                        <input type="text" v-model="address" name="address" id="address" />
                    </div>
                    <div class="register-address">
                        <label for="phone">Téléphone</label>
                        <input type="text" v-model="phone" @input="validateInput" name="phone" id="phone" />
                    </div>
                    <div class="register-address">
                        <label>Type de cuisine : </label>
                        <select id="type-kitchen" v-model="cookingType">
                            <option value="">Sélectionnez un type de cuisine</option>
                            <option value="francais">Cuisine française</option>
                            <option value="italienne">Cuisine italienne</option>
                            <option value="mexicaine">Cuisine mexicaine</option>
                            <option value="chinoise">Cuisine chinoise</option>
                        </select>
                    </div>
                    <div class="register-address">
                        <label>Fourchettes prix : </label>
                        <select id="price" v-model="price">
                            <option value="">Sélectionnez la fourchette de prix : </option>
                            <option value="€ (-50€)">€ (-50€)</option>
                            <option value="€€ (50€ - 80€)">€€ (50€ - 80€)</option>
                            <option value="€€€ (+ 80€)">€€€ (+ 80€)</option>
                        </select>
                    </div>
                    <div class="register-cultery">
                        <label>Nombre de couverts maximum : </label>
                        <input style="width: 60px;" required type="number" v-model="cultery" min="1" value="1" />
                    </div>
                    <div class="register-date">
                        <label>Horaires :</label>
                        <div class="date" v-for="(day, index) in days" :key="index">
                            <label>{{ day }}</label>
                            <input type="checkbox" v-model="selectedDays[index]" @change="toggleDay(index)">
                            <input style="width: 100px;" type="time" v-model="openingHours[index]"
                                :disabled="!selectedDays[index]">
                            <input style="width: 100px;" type="time" v-model="closingHours[index]"
                                :disabled="!selectedDays[index]">
                        </div>
                    </div>
                    <div class="register-break">
                        <label>Faites-vous une coupure entre vos services ? <input type="checkbox"
                                v-model="isBreak"></label>
                        <input v-if="isBreak" style="width: 100px; margin:5px; text-align: center;" type="time"
                            v-model="breakTime[0]">
                        <input v-if="isBreak" style="width: 100px; margin:5px; text-align: center;" type="time"
                            v-model="breakTime[1]">
                        <label>Prenez-vous des vacances ? <input type="checkbox" v-model="vacancy"></label>
                        <label v-if="vacancy">Du</label><input v-if="vacancy"
                            style="width: 120px; margin:5px; text-align: center; padding:5px" type="date"
                            v-model="vacancyTime[0]">
                        <label v-if="vacancy">Au</label><input v-if="vacancy"
                            style="width: 120px; margin:5px; text-align: center; padding:5px" type="date"
                            v-model="vacancyTime[1]">
                    </div>
                    <br>
                    <div class="register-address">
                        <label>Possédez-vous une terrasse ? : </label>
                        <label><input type="checkbox" v-model="hasTerrace"></label>
                    </div>
                    <div class="register-address">
                        <label>Acceptez-vous les chiens ? : </label>
                        <label><input type="checkbox" v-model="acceptsDogs"></label>
                    </div>
                    <div class="register-payement">
                        <label>Acceptez-vous ? : </label>
                        <label><input style="margin-left:5px;" type="checkbox" v-model="payments.visa"> visa</label>
                        <label><input style="margin-left:5px;" type="checkbox" v-model="payments.mastercard">
                            mastercard</label>
                        <label><input style="margin-left:5px;" type="checkbox" v-model="payments.maestro">
                            maestro</label>
                    </div>
                </form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">Annuler</el-button>
                    <el-button type="primary" @click="handleAddRestaurant">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style scoped>
h2 {
    text-align: center;
    padding-bottom: 10px;
}

.button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 70vh;
}

.button {
    width: 500px;
    height: 100px;
    font-size: 26px;
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

.register-address {
    margin-bottom: 10px;

}

.register-address input {
    width: 100%;
}

.register-date {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
}

.date {
    display: flex;
    align-items: center;
    margin-top: 5px;

}

.date label {
    width: 80px;
    margin-right: 10px;
}

.date input[type="checkbox"] {
    margin-right: 10px;
    margin-bottom: 5px;
}

.date input[type="time"] {
    margin: 5px;
}

.form-container .register-condition {
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: end;
}

select {
    padding: 1px 4px;
    border-radius: 4px;
    border: 3px solid #7c9d45;
    outline: none;
    font-size: 15px;
    margin: 5px;
}

.register-break {
    display: flex;
    flex-direction: column;
    align-items: center;

}

.register-break label {
    margin-bottom: 10px;
    text-align: center;
}

@media (max-width: 868px) {
    h2 {
        font-size: 20px;

    }

    .button {
        width: 350px;
        height: 75px;
        font-size: 16px;
    }


    .register-container form input,
    .register-container form select,
    .register-container form .date input[type="time"] {
        width: 90%;
        margin-right: 15px;
        text-align: center;

    }

    .register-container form label {
        margin: 0;
    }

    .date {
        flex-direction: column;
        align-items: center;
    }

    .date label,
    .date input[type="checkbox"] {
        width: auto;
        margin-right: 0;
        margin-bottom: 5px;
    }

    select {
        margin: 0px;
    }

    .register-cultery {
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .register-cultery input {
        margin: 5px;

    }

    .register-payement {
        display: flex;
        gap: 10px;
    }
}
</style>