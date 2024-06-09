<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const dialogVisible = ref(false)
const reservationDate = ref<string | null>(null)
const numberOfPersons = ref<string>('2')
const arrivalTime = ref<string>('12:00')

const popup = () => {
    dialogVisible.value = true
}

const router = useRouter()

const createCheckoutSession = async (price: number) => {
    const token = Cookies.get('authBR')

    try {
        const response = await fetch('http://localhost:3333/api/payment/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                amount: price * 100, // Stripe expects the amount in cents
                currency: 'eur',
                successUrl: 'http://localhost:3000/success',
                cancelUrl: 'http://localhost:3000/cancel',
                items: [
                    { name: 'Premium Subscription', price: price * 100, quantity: 1 },
                ],
            }),
        })

        const data = await response.json()

        if (data.url) {
            window.location.href = data.url // Redirection vers la page de paiement Stripe
        } else {
            console.error('Error creating checkout session:', data)
        }
    } catch (error) {
        console.error('Error creating checkout session:', error)
    }
}

const handleUpgrade = (price: number) => {
    createCheckoutSession(price)
}
</script>

<template>
    <div class="container orders">
        <h3>
            Notre abonnement mensuel vous offre une visibilité accrue auprès des utilisateurs de BetterRestaurant. Votre
            restaurant sera mis en avant de manière aléatoire lorsqu'ils effectuent des recherches et sera également
            recommandé sur les pages d'autres restaurants.
        </h3>
        <div class="payement-container">
            <div class="payement">
                <h4>Abonnement standard</h4>
                <p>Cet abonnement comprend :</p>
                <p>hébergement de votre restaurant</p>
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
                <p>5.99€</p>
                <el-button type="success" @click="handleUpgrade(5.99)">Upgrade</el-button>
            </div>
            <div class="payement">
                <h4>Abonnement premium +</h4>
                <p>Cet abonnement comprend :</p>
                <p>boost de visibilité pendant les recherches et sur les pages d'autres restaurants</p>
                <p>support prioritaire en cas de bug</p>
                <p>9.99€</p>
                <el-button type="success" @click="handleUpgrade(9.99)">Upgrade</el-button>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="Tips" width="500">
            <p>Résumé de la réservation : {{ numberOfPersons }} personne(s) | {{ reservationDate }} | {{ arrivalTime }}
            </p>
            <label><input type="checkbox" name="option1"> Terrasse</label><br>
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