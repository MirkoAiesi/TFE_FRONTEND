<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
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

const isBreak = ref(false);
const breakTime = ref(['', '']);
const vacancy = ref(false);
const vacancyTime = ref(['', '']);

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

</script>
<template>
    <div class="container orders">
        <div class="container-scroll">
            <h3>Paramètres</h3>
            <form>
                <div>
                    <div>
                        <label for="restaurantName">Restaurant</label>
                        <input type="text" v-model="restaurantName" name="restaurantName" id="restaurantName" />
                        <label for="address">Adresse</label>
                        <input type="text" v-model="address" name="address" id="address" />
                        <label for="phone">Téléphone</label>
                        <input type="text" v-model="phone" @input="validateInput" name="phone" id="phone" />
                    </div>
                    <div>
                        <div class="checkbox">
                            <label>Nombre de couverts maximum : </label>
                            <input style="width: 40px; margin:5px; padding:5px; text-align: center;" required
                                type="number" name="restaurant_number" id="restaurant_number" min="1" value="1" />
                            <label>Posseder vous une terrasse ? : </label>
                            <label><input type="checkbox" name="terrasse"></label>
                            <label>Accepter vous les chiens : </label>
                            <label><input type="checkbox" name="terrasse"></label>
                            <label>Quelle payement accepter vous : </label>
                            <label><input type="checkbox" name="terrasse">VISA</label>
                            <label><input type="checkbox" name="terrasse">MASTERCARD</label>
                            <label><input type="checkbox" name="terrasse">MAESTRO</label>
                        </div>
                    </div>
                </div>
                <el-button size="large" class="paramsButton" type="primary" round>Modifier</el-button>
            </form>
            <el-divider />
            <h3> Horaires</h3>
            <div class="register-date">
                <div class="date" v-for="(day, index) in days" :key="index">
                    <label>{{ day }}</label>
                    <input type="checkbox" v-model="selectedDays[index]" @change="toggleDay(index)">
                    <input type="time" v-model="openingHours[index]" :disabled="!selectedDays[index]">
                    <input type="time" v-model="closingHours[index]" :disabled="!selectedDays[index]">
                </div>
                <div class="date-btn">
                    <el-button size="large" class="paramsButton" type="primary" round>Modifier</el-button>
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
                <el-button size="large" class="paramsButton" type="primary" round>Modifier</el-button>
            </div>
            <el-divider />
            <div class="paramsOptions">
                <el-button size="large" class="paramsButton" type="danger" round>Supprimer le restaurant</el-button>
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

form input[type=checkbox] {
    margin: 5px;
}

.paramsButton {
    margin-top: 20px;
    width: fit-content;
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