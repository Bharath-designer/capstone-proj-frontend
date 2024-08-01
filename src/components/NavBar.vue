<template>
    <GoogleLoginDialog v-if="showGoogleLoginPopup" @close="showGoogleLoginPopup = false" />
    <div class="nav-bar-wrapper">
        <div class="logo-container">
            <img @click="goToHome" :src="require('../assets/Brokerless_Logo.svg')" alt="">
        </div>
        <div class="nav-right-container">
            <button v-if="showPostYourPropertyBtn" class="post-property-btn">
                Post your property
            </button>
            <button v-if="user == null" @click="toggleGoogleLoginPopup" class="login-btn">
                Login
            </button>
            <button @click="goToProfile" v-else class="profile-icon">
                <img @error="handleImageError" draggable="false" :src="user.profilePic">
            </button>
        </div>
    </div>
</template>

<script>
import GoogleLoginDialog from './GoogleLoginDialog.vue';

export default {
    components: {
        GoogleLoginDialog
    },
    data: () => {
        return {
            showGoogleLoginPopup: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        showPostYourPropertyBtn() {
            return this.$route.name === "Home"
        }
    },
    methods: {
        handleImageError(event) {
            event.target.src = require("@/assets/profile-fallback.jpg");
        },

        goToProfile() {
            this.$router.push({ name: "BasicProfile" })
        },
        goToHome() {
            this.$router.push({ name: "Home" })
        },
        toggleGoogleLoginPopup() {
            this.showGoogleLoginPopup = !this.showGoogleLoginPopup
        }
    }
}
</script>

<style scoped lang="scss">
.nav-bar-wrapper {
    display: flex;
    padding: 1em 2em;
    justify-content: space-between;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    align-items: center;
    background: white;

    .logo-container {
        display: flex;

        img {
            cursor: pointer;
            height: 1.1em;
        }
    }

    .nav-right-container {
        display: flex;
        gap: 2em;

        button {
            border: none;
            outline: none;
            background: none;
            cursor: pointer;
        }

        .profile-icon {
            display: flex;

            img {
                width: 2.3em;
                aspect-ratio: 1;
                border-radius: 50%;
                user-select: none;
                object-fit: cover;
                object-position: top;
            }
        }

        .post-property-btn {
            background: var(--primary-color);
            color: white;
            font-weight: 500;
            font-size: .9em;
            border-radius: .2em;
            padding: .3em 1em;
            font-family: inter;
        }

        .login-btn {
            font-weight: 500;
        }

    }
}
</style>
