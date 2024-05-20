<script lang="ts" setup>
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
</script>
<template>
    <div class="container orders">
        <div class="container-scroll">
            <h3>Paramètres</h3>
            <form>
                <div>
                    <div>
                        <label for="firstname">Restaurant</label>
                        <input type="text" name="firstname" id="lastname" />
                        <label for="lastname">Adresse</label>
                        <input type="text" name="lastname" id="lastname" />
                        <label for="lastname">Téléphone</label>
                        <input type="text" name="phone" id="phone" />
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
                <el-button size="large" class="paramsButton" type="primary" round>Modifier</el-button>
            </div>

            <el-divider />
            <form class="passwordParams">
                <h3>Sécurité</h3>
                <div>
                    <div>
                        <label for="password">Mot de passe</label>
                        <input type="text" name="password" id="password" />
                    </div>
                    <div>
                        <label for="confirm">Confirmer</label>
                        <input type="text" name="confirm" id="confirm" />
                    </div>
                </div>
                <el-button size="large" class="paramsButton" type="primary" round>Modifier</el-button>
            </form>
            <el-divider />
            <div class="paramsOptions">
                <el-button size="large" class="paramsButton" type="danger" round>Supprimer le compte</el-button>
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
</style>