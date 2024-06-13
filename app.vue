<script>
import Navbar from "./components/nav-bar.vue";
import Footer from "./components/footer.vue";
export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<template>
  <div class="app-container">
    <VitePwaManifest />
    <Navbar />
    <NuxtPage />
    <Footer class="footer" />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
}

:root {
  --el-color-primary: #6e8b3d;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.NuxtPage {
  flex: 1;
}

.footer {
  margin-top: auto;
}
</style>
