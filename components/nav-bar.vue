<script lang="ts" setup>
import { Avatar, Menu } from "@element-plus/icons-vue";
import { ref } from "vue";
import Cookies from "js-cookie";

const handleProfile = () => {
  const token = Cookies.get('authBR')
  if (token) {
    navigateTo('/profil')
  } else {
    navigateTo('/auth/login')
  }
}
const isOpen = ref(false);
const openBurgerMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <nav>
    <img src="../public/pictures/logo.PNG" alt="" />
    <div class="burger-menu" :class="{ 'burger-menu-open': isOpen }">
      <NuxtLink to="/">
        <p>Accueil</p>
      </NuxtLink>
      <NuxtLink to="../search">
        <p>Les restaurants</p>
      </NuxtLink>
      <NuxtLink to="../restorer">
        <p>Restaurateurs</p>
      </NuxtLink>
      <NuxtLink to="/support">
        <p>Support</p>
      </NuxtLink>
    </div>
    <div class="nav-button">
      <el-icon class="burger-icon" :size="30" @click="openBurgerMenu">
        <Menu />
      </el-icon>
      <el-icon @click="handleProfile" class="avatar-icon" :size="30">
        <Avatar />
      </el-icon>
    </div>
  </nav>
</template>

<style scoped>
.nav-button {
  display: flex;
  align-items: center;
}

nav img {
  position: relative;
  width: 80px;
  height: 80px;
}

nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

nav div {
  display: flex;
}

nav div a {
  margin: 0 10px;
  text-decoration: none;
  font-size: 18px;
  padding: 0 20px;
  color: black;
}

nav div a p {
  margin: 8px 0;
}

nav div a:hover {
  border-radius: 8px;
  background-color: #6e8b3d;
  color: white;
}

.avatar-icon {
  outline: none;
  color: black;
  border: 2px solid black;
  padding: 5px;
  border-radius: 25px;
}

.avatar-icon:hover {
  cursor: pointer;
}

.dropdown a {
  text-decoration: none;
  color: black;
}

.burger-icon {
  display: none;
}

@media (max-width: 868px) {
  .burger-icon {
    display: block;
  }

  nav {
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .avatar-icon {
    margin-left: 20px;
  }

  .burger-menu {
    position: absolute;
    background-color: white;
    flex-direction: column;
    align-items: center;
    left: 0;
    top: -900px;
    width: 100%;
  }

  .burger-menu-open {
    top: 90px;
  }
}
</style>
