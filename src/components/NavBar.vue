<template>
    <GoogleLoginDialog v-if="showGoogleLoginPopup" @close="showGoogleLoginPopup = false"/>
    <div class="nav-bar-wrapper">
        <div class="logo-container">
            <img :src="require('../assets/Brokerless_Logo.svg')" alt="">
        </div>
        <div class="nav-right-container">
            <button class="post-property-btn">
                Post your property
            </button>
            <button v-if="user == null" @click="toggleGoogleLoginPopup" class="login-btn">
                Login
            </button>
            <button v-else class="profile-icon">
                <img draggable="false" :src="user.profilePic" >
            </button>
        </div>
    </div>
</template>

<script>
import GoogleLoginDialog from './GoogleLoginDialog.vue';

export default {
    components : {
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
        }
    },
    methods: {
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

    .logo-container {
        display: flex;
        img {
            height: 1.1em;
        }
    }

    .nav-right-container {
        display: flex;
        align-items: center;
        gap: 2em;

        .profile-icon {
            display: flex;

            img {
                width: 2.1em;
                aspect-ratio: 1;
                border-radius: 50%;
                user-select: none;
            }
        }
        
        .post-property-btn {
            background: var(--primary-color);   
            color: white;    
            font-weight: 500;
            padding: .5em 1em;
            font-size: .9em;
            border-radius: .2em;
        }

        .login-btn {
            font-weight: 500;
        }
        
    }
}

</style>
