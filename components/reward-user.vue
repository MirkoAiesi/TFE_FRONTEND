<script lang="ts" setup>
import { ref } from 'vue';

const dialogVisible = ref(false);
const reward = ref(750); // Valeur initiale des points
const rewardCost = ref(0); // Variable pour stocker le coût de la récompense

const openPopup = (cost: number) => {
    rewardCost.value = cost;
    dialogVisible.value = true;
};

const confirmTransaction = () => {
    reward.value -= rewardCost.value;
    dialogVisible.value = false;
};
</script>

<template>
    <div class="container orders">
        <h3>Ici vous pouvez dépenser vos points accumulez grâce à vos réservations et à vos avis
            en utilisant BetterRestaurant.
        </h3>
        <br>
        <p> Vous accumez actuellement {{ reward }} point(s)</p>
        <br>
        <p> Pour rappel : </p>
        <p>Une réservation = 20 points de fidélité</p>
        <p>Un avis sur un restaurant où vous avez mangé = 5 points de fidélité</p>
        <div class="payement-container">
            <div class="payement">
                <h4>Bon 5 % de réduction </h4>
                <p>100 points</p>
                <el-button type="success" @click="openPopup(100)" :disabled="reward < 100">
                    Utiliser
                </el-button>
            </div>
            <div class="payement">
                <h4>Bon 10 % de réduction</h4>
                <p>200 points</p>
                <el-button type="success" @click="openPopup(200)" :disabled="reward < 200">
                    Utiliser
                </el-button>
            </div>
            <div class="payement">
                <h4>Bon 20 % de réduction</h4>
                <p>500 points</p>
                <el-button type="success" @click="openPopup(500)" :disabled="reward < 500">
                    Utiliser
                </el-button>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="Récompense" width="500">
            <p>Êtes-vous sûr de dépenser {{ rewardCost }} points ?</p>
            <p>Il vous restera {{ reward - rewardCost }} points après cette transaction.</p>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="dialogVisible = false">
                        Refuser
                    </el-button>
                    <el-button type="primary" @click="confirmTransaction">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
@media (max-width: 868px) {
    .orders h3 {
        font-size: 14px;
    }

    p {
        font-size: 12px;
    }
}
</style>
