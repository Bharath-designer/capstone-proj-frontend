<template>
    <div class="home-wrapper" style="width: 300px;">
        <div class="home-search-container">
            <div class="slogan">Buy or Sell Property from your home</div>
            <div class="home-search-content">
            </div>
        </div>
    </div>
</template>

<script>

import states from "@/utilities/StateList"

export default {
    name: "Home",
    data() {
        return {
            states
        }
    },
    computed: {
        user() {
            console.log(this.$store.state.user);
            return this.$store.state.user
        }
    }
}
</script>

<style scoped lang="scss">
.home-wrapper {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column
}
</style>