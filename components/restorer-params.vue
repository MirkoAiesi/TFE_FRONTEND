<script lang="ts" setup>
import { ref, watch, nextTick, watchEffect } from 'vue';
import { ElMessage } from 'element-plus';
import { modifyRestaurant, deleteRestaurant } from '../services/userService';
import { useRestaurantStore } from '../services/restaurantStore';

const { restaurant } = useRestaurantStore();

const days = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
const selectedDays = ref([false, false, false, false, false, false, false]);
const openingHours = ref(['', '', '', '', '', '', '']);
const closingHours = ref(['', '', '', '', '', '', '']);

const restaurantName = ref('');
const address = ref('');
const phone = ref('');
const desc = ref('test');
const cookingType = ref('francais');
const price = ref('€€ (50€ - 80€)');
const cultery = ref(10);
const isBreak = ref(false);
const breakTime = ref(['', '']);
const vacancy = ref(false);
const vacancyTime = ref(['', '']);

const dogsAllowed = ref(false);
const terrasse = ref(false);
const paymentMethods = ref<string[]>([]);

interface Schedule {
    [day: string]: [string, string];
}

watchEffect(() => {
    if (restaurant.value) {
        restaurantName.value = restaurant.value.name;
        address.value = restaurant.value.address;
        phone.value = restaurant.value.phone;
        desc.value = restaurant.value.desc;
        cookingType.value = restaurant.value.cookingType;
        price.value = restaurant.value.price;
        cultery.value = restaurant.value.cultery;

        const parsedSchedule: Schedule = restaurant.value.schedule as Schedule;
        if (parsedSchedule) {
            days.value.forEach((day, index) => {
                const lowerCaseDay = day.toLowerCase();
                if (parsedSchedule[lowerCaseDay]) {
                    if (parsedSchedule[lowerCaseDay][0] === 'fermé' && parsedSchedule[lowerCaseDay][1] === 'fermé') {
                        selectedDays.value[index] = false;
                        openingHours.value[index] = '';
                        closingHours.value[index] = '';
                    } else {
                        selectedDays.value[index] = true;
                        openingHours.value[index] = parsedSchedule[lowerCaseDay][0];
                        closingHours.value[index] = parsedSchedule[lowerCaseDay][1];
                    }
                } else {
                    selectedDays.value[index] = false;
                    openingHours.value[index] = '';
                    closingHours.value[index] = '';
                }
            });
        }

        if (restaurant.value.cut_time) {
            isBreak.value = true;
            breakTime.value = restaurant.value.cut_time.split('-');
        } else {
            isBreak.value = false;
        }

        if (restaurant.value.vacancy) {
            vacancy.value = true;
            vacancyTime.value = restaurant.value.vacancy.split('-');
        } else {
            vacancy.value = false;
        }
        const option = restaurant.value.options.split(', ');
        dogsAllowed.value = option[0] === 'oui';
        terrasse.value = option[1] === 'oui';
        paymentMethods.value = option.slice(2);
    }
});

const toggleDay = (index: number) => {
    if (!selectedDays.value[index]) {
        openingHours.value[index] = '';
        closingHours.value[index] = '';
    }
};

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

const phoneRegex = /^\d{9,10}$/;
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

const modify = async () => {
    try {
        const schedule: Schedule = {};
        days.value.forEach((day, index) => {
            const lowerCaseDay = day.toLowerCase();
            schedule[lowerCaseDay] = [
                selectedDays.value[index] ? openingHours.value[index] : 'fermé',
                selectedDays.value[index] ? closingHours.value[index] : 'fermé',
            ];
        });
        const optionsArray = [
            document.querySelector('input[name="dogsAllowed"]:checked') ? "oui" : "non",
            document.querySelector('input[name="terrasse"]:checked') ? "oui" : "non",
            document.querySelector('input[name="visa"]:checked') ? 'visa' : '',
            document.querySelector('input[name="mastercard"]:checked') ? 'mastercard' : '',
            document.querySelector('input[name="maestro"]:checked') ? 'maestro' : ''
        ];

        const options = optionsArray.filter(option => option !== '').join(', ');
        const restaurantData = {
            name: restaurantName.value,
            address: address.value,
            phone: phone.value,
            desc: desc.value,
            price: price.value,
            cultery: cultery.value,
            cooking_type: cookingType.value,
            options,
            schedule,
            breakTime: isBreak.value ? breakTime.value : null,
            vacancyTime: vacancy.value ? vacancyTime.value : null,
        };

        const response = await modifyRestaurant(restaurantData);
        console.log('Restaurant modified:', response);
        ElMessage({
            type: 'success',
            message: 'Restaurant modifié avec succès',
        });
    } catch (e) {
        console.error('Error modifying restaurant:', e);
        ElMessage({
            type: 'error',
            message: 'Erreur lors de la modification du restaurant',
        });
    }
};

const handleDeleteRestaurant = async () => {
    try {
        const confirmation = confirm('Etes vous sûr de supprimer votre restaurant ? Cette action est irréversible.');
        if (confirmation) {
            const response = await deleteRestaurant();
            console.log(response);
            alert('Restaurant supprimé avec succès.');
            navigateTo('/');
        }
    } catch (error) {
        console.error('Failed to delete restaurant:', error);
        alert('Failed to delete restaurant');
    }
};
</script>
<template>
    <div class="container orders">
        <div class="container-scroll">
            <h3>Paramètres</h3>
            <form @submit.prevent="modify">
                <div>
                    <div>
                        <label for="restaurantName">Restaurant</label>
                        <input type="text" v-model="restaurantName" name="restaurantName" id="restaurantName" />
                        <label for="address">Adresse</label>
                        <input type="text" v-model="address" name="address" id="address" />
                        <label for="phone">Téléphone</label>
                        <input type="text" v-model="phone" @input="validateInput" name="phone" id="phone" />
                        <label>Type de cuisine : </label>
                        <select id="type-kitchen" v-model="cookingType">
                            <option value="">Sélectionnez un type de cuisine</option>
                            <option value="francais">Cuisine française</option>
                            <option value="italienne">Cuisine italienne</option>
                            <option value="mexicaine">Cuisine mexicaine</option>
                            <option value="chinoise">Cuisine chinoise</option>
                        </select>
                        <label>Fourchettes prix : </label>
                        <select id="price" v-model="price">
                            <option value="">Sélectionnez la fourchette de prix : </option>
                            <option value="€ (-50€)">€ (-50€)</option>
                            <option value="€€ (50€ - 80€)">€€ (50€ - 80€)</option>
                            <option value="€€€ (+ 80€)">€€€ (+ 80€)</option>
                        </select>
                    </div>
                    <div>
                        <div class="checkbox">
                            <label>Nombre de couverts maximum : </label>
                            <input v-model="cultery" style="width: 40px; margin:5px; padding:5px; text-align: center;"
                                required type="number" name="restaurant_number" id="restaurant_number" min="1"
                                value="1" />
                            <label>Acceptez-vous les chiens :</label>
                            <label><input type="checkbox" v-model="dogsAllowed" name="dogsAllowed"></label>
                            <label>Possédez-vous une terrasse ? : </label>
                            <label><input type="checkbox" v-model="terrasse" name="terrasse"></label>
                            <label>Quel paiement acceptez-vous : </label>
                            <label><input type="checkbox" v-model="paymentMethods" :value="'visa'"
                                    name="visa">VISA</label>
                            <label><input type="checkbox" v-model="paymentMethods" :value="'mastercard'"
                                    name="mastercard">MASTERCARD</label>
                            <label><input type="checkbox" v-model="paymentMethods" :value="'maestro'"
                                    name="maestro">MAESTRO</label>
                        </div>
                    </div>
                </div>
            </form>
            <el-divider />
            <h3>Horaires</h3>
            <div class="register-date">
                <div class="date" v-for="(day, index) in days" :key="index">
                    <label>{{ day }}</label>
                    <input type="checkbox" v-model="selectedDays[index]" @change="toggleDay(index)">
                    <input type="time" v-model="openingHours[index]" :disabled="!selectedDays[index]">
                    <input type="time" v-model="closingHours[index]" :disabled="!selectedDays[index]">
                </div>
            </div>
            <el-divider />
            <div class="register-break">
                <label>Changement de coupure entre vos services ? <input type="checkbox" name="break"
                        v-model="isBreak"></label>
                <input v-if="isBreak" style="width: 100px; margin:5px; text-align: center" type="time"
                    v-model="breakTime[0]">
                <input v-if="isBreak" style="width: 100px; margin:5px; text-align: center" type="time"
                    v-model="breakTime[1]">
                <label v-if="isBreak"> Plus de coupure entre vos services ?<input v-if="isBreak" type="checkbox"
                        name="noCut"></label>
                <label>Changement de période de vacances ? <input type="checkbox" name="vacancy"
                        v-model="vacancy"></label>
                <label v-if="vacancy">Du</label><input v-if="vacancy"
                    style="width: 120px; margin:5px; text-align: center; padding:5px" type="date"
                    v-model="vacancyTime[0]">
                <label v-if="vacancy">Au</label><input v-if="vacancy"
                    style="width: 120px; margin:5px; text-align: center; padding:5px" type="date"
                    v-model="vacancyTime[1]">
                <label v-if="vacancy"> Plus de vacances ?<input v-if="vacancy" type="checkbox" name="noVacancy"></label>
            </div>
            <el-divider />
            <div class="register-date">
                <el-button size="large" class="paramsButton" type="primary" round
                    @click.prevent="modify">Modifier</el-button>
                <el-divider />
            </div>
            <div class="paramsOptions">
                <el-button size="large" class="paramsButton" type="danger" round
                    @click="handleDeleteRestaurant">Supprimer
                    le restaurant</el-button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container-scroll {
    overflow-y: auto;
}

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
    margin-top: 20px;
}

form div div input {
    font-size: 14px;
}

form input[type=text] {
    padding: 5px;
    border: 1px solid gray;
    border-radius: 4px;
    font-size: 14px;
    width: 250px;
}

form div div select {
    padding: 5px;
    border: 1px solid gray;
    border-radius: 4px;
    font-size: 14px;
    width: 250px;
}

form input[type=checkbox] {
    margin: 5px;
}

.paramsButton {
    margin-top: 20px;
    width: fit-content;
    justify-content: center;
}

.paramsOptions {
    display: flex;
    justify-content: space-between;
}

.register-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
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
    text-align: center;
    margin: 5px;
    width: 100px;
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
    form div {
        flex-direction: column;
    }

    form input[type=text] {
        width: 200px;
    }

    .orders h3 {
        font-size: 16px;
    }

    form label {
        font-size: 14px;
        margin: 10px;
    }

    .paramsButton {
        width: 40%;
        font-size: 10px;
    }

    .register-date {
        display: block;
    }

    .date-btn {
        display: flex;
        justify-content: center;
    }

    .register-break label {
        font-size: 14px;

    }
}
</style>