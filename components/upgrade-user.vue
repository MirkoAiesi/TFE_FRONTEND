<script lang="ts" setup>

const dialogVisible = ref(false)
const popup = () => {

    dialogVisible.value = true

};
const reservationDate = ref(null)
const numberOfPersons = ref('2')
const arrivalTime = ref('12:00')
</script>

<template>
    <div class="container orders">
        <p>Notre abonnement mensuel vous offre une visibilité accrue auprès des utilisateurs de BetterRestaurant. Votre
            restaurant sera mis en avant de manière aléatoire lorsqu'ils effectuent des recherches et sera également
            recommandé sur les pages d'autres restaurants.
        </p>
        <div class="payement-container">
            <div class="payement">
                <h4>Abonnement standard</h4>
                <p>Cet abonnement comprend :</p>
                <p>hebergement de votre restaurant</p>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <p>Gratuit</p>
                <el-button plain disabled>Actif</el-button>
            </div>
            <div class="payement">
                <h4>Abonnement premium</h4>
                <p>Cet abonnement comprend :</p>
                <p>boost de visibilité pendant les recherches</p>
                <p>support prioritaire en cas de bug</p>
                <div></div>
                <div></div>
                <div></div>
                <p>5.99€</p>
                <el-button type="success" @click=popup()>Upgrade</el-button>
            </div>
            <div class="payement">
                <h4>Abonnement premium + </h4>
                <p>Cet abonnement comprend :</p>
                <p>boost de visibilité pendant les recherches et sur les pages d'autres restaurants</p>
                <p>support prioritaire en cas de bug</p>
                <p>9.99€</p>
                <el-button type="success" @click=popup()>Upgrade</el-button>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="Tips" width="500">
            <p>Résumé de la réservation : {{ numberOfPersons }} personne(s) | {{ reservationDate }} | {{ arrivalTime }}
            </p>
            <label><input type="checkbox" name="option1"> Terrasse</label> <br>
            <label><input type="checkbox" name="option2"> Chien</label>
            <p>Demande(s) particulière(s)</p>
            <textarea style="resize:none; width: 100%; height: 50px;"></textarea>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="dialogVisible = false">
                        Refuser
                    </el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>