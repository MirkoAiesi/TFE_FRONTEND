<template>
    <div class="container orders">
        <h3>Ici vous pouvez renseigner les liens vers vos réseaux sociaux, ceux-ci seront affichés et cliquable sur
            votre page de restaurant</h3>
        <h4>Lien vers Facebook</h4><input style="width: 100%; margin:5px;" required type="text" name="facebook"
            id="restaurant_address" />
        <h4>Lien vers Instagram</h4><input style="width: 100%; margin:5px;" required type="text" name="insta"
            id="restaurant_address" />
        <h4>Lien vers votre site web</h4><input style="width: 100%; margin:5px;" required type="text" name="web"
            id="restaurant_address" />
        <div class="container_btn">
            <el-button size="large" class="btn-social" type="primary" round>Modifier</el-button>
        </div>
    </div>
</template>
<style scoped>
.container_btn {
    display: flex;
    justify-content: center;
}

.btn-social {
    margin-top: 10px;
    width: 33%;
}
</style>