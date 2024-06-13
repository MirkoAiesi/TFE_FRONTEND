<script lang="ts" setup>
import Cookies from 'js-cookie'

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
                amount: price * 100,
                currency: 'eur',
                successUrl: 'http://localhost:3000/payements/success',
                cancelUrl: 'http://localhost:3000/payements/cancel',
                items: [
                    { name: 'Premium Subscription', price: price * 100, quantity: 1 },
                ],
            }),
        })

        const data = await response.json()

        if (data.url) {
            window.location.href = data.url
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