<script lang="ts" setup>
import { ref } from 'vue'

const dialogVisible = ref(false)

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

const isBreak = ref(false)
const breakTime = ref(['', ''])
const vacancy = ref(false)
const vacancyTime = ref(['', ''])
</script>
<template>

    <div class="button-container">
        <h2>Vous avez un restaurant ? </h2>
        <el-button plain @click="dialogVisible = true" class="button">Cliquez ici pour vous créer une page</el-button>
        <el-dialog v-model="dialogVisible" title="Création de votre page" width="500">
            <div class="register-container">
                <form>
                    <div class="register-address">
                        <div>
                            <label>Nom du restaurant</label>
                            <input style="width: 100%;" required type="text" name="restaurant_name"
                                id="restaurant_name" />
                        </div>
                    </div>
                    <div class="register-address">
                        <label>Adresse du restaurant</label>
                        <input style="width: 100%;" required type="text" name="restaurant_address"
                            id="restaurant_address" />
                    </div>
                    <div class="register-address">
                        <label>Téléphone : </label>
                        <input style="width: 100%;" required type="string" name="restaurant_phone"
                            id="restaurant_phone" />
                    </div>
                    <div class="register-address">
                        <label>Type de cuisine : </label>
                        <select id="type-kitchen">
                            <option value="">Sélectionnez un type de cuisine</option>
                            <option value="francaise">Cuisine française</option>
                            <option value="italienne">Cuisine italienne</option>
                            <option value="mexicaine">Cuisine mexicaine</option>
                            <option value="chinoise">Cuisine chinoise</option>
                            <!-- Ajoutez d'autres options pour les types de cuisine selon vos besoins -->
                        </select>
                    </div>
                    <div class="register-address">
                        <label>Fourchettes prix : </label>
                        <select id="price">
                            <option value="">Sélectionnez la fourchette de prix : </option>
                            <option value="low">€ (-50€)</option>
                            <option value="medium">€€ (50€ - 80€)</option>
                            <option value="high">€€€ (+ 80€)</option>
                        </select>
                    </div>
                    <div>
                        <label>Nombre de couverts maximum : </label>
                        <input style="width: 60px;" required type="number" name="restaurant_number"
                            id="restaurant_number" min="1" value="1" />
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
                        <label>Faites vous une coupure entre vos services ? <input type="checkbox" name="break"
                                v-model="isBreak"></label>
                        <input v-if="isBreak" style="width: 100px; margin:5px;" type="time" v-model="breakTime[0]">
                        <input v-if="isBreak" style="width: 100px; margin:5px;" type="time" v-model="breakTime[1]">

                        <label>Prenez vous des vacances ? <input type="checkbox" name="vacancy"
                                v-model="vacancy"></label>
                        <label v-if="vacancy">Du</label><input v-if="vacancy" style="width: 100px; margin:5px;"
                            type="text" v-model="vacancyTime[0]">
                        <label v-if="vacancy">Au</label><input v-if="vacancy" style="width: 100px; margin:5px;"
                            type="test" v-model="vacancyTime[1]">

                    </div>
                    <br>
                    <div class="register-address">
                        <label>Posseder vous une terrasse ? : </label>
                        <label><input type="checkbox" name="terrasse"></label>
                    </div>
                    <div class="register-address">
                        <label>Accepter vous les chiens ? : </label>
                        <label><input type="checkbox" name="dog"></label>
                    </div>
                    <div class="register-address">
                        <label>Accepter vous? : </label>
                        <label><input style="margin-left:5px;" type="checkbox" name="visa"> visa</label>
                        <label><input style="margin-left:5px;" type="checkbox" name="mastercard"> mastercard</label>
                        <label><input style="margin-left:5px;" type="checkbox" name="maestro"> maestro</label>
                    </div>
                </form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">Annuler</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
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
</style>