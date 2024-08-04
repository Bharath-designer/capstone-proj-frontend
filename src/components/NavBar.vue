<template>
    <GoogleLoginDialog v-if="showGoogleLoginPopup" @close="showGoogleLoginPopup = false" />
    <div class="nav-bar-wrapper">
        <div class="logo-container">
            <img @click="goToHome" :src="require('../assets/Brokerless_Logo.svg')" alt="">
        </div>
        <div class="nav-right-container">
            <el-tooltip v-if="showPostYourPropertyBtn" class="box-item" :disabled="user !== null"
                effect="dark" content="Login to post property" placement="bottom-start">
                <button @click="goToPostProperty" :disabled="user === null" class="post-property-btn">
                    Post your property
                </button>
            </el-tooltip>
            <button v-if="user == null" @click="toggleGoogleLoginPopup" class="login-btn">
                Login
            </button>
            <button @click="goToProfile" v-else-if="!disableProfileIcon" class="profile-icon" :class="{isAdmin: user?.userRole === 'Admin'}">
                <img @error="handleImageError" draggable="false" :src="user.profilePic">
                <div @click="logoutUser" class="logout-admin">
                    Logout
                </div>
            </button>
            <button v-if="showMenu" class="nav-icon" @click="toggleNavbar">
                <img class="close" v-if="isNavBarOpen" :src="require('@/assets/close.svg')" alt="">
                <img v-else-if="showFilter" class="filter" :src="require('@/assets/filter-icon.svg')" alt="">
                <img v-else :src="require('@/assets/hamburger.svg')" alt="">
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
            showGoogleLoginPopup: false,
            isNavBarOpen: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        showPostYourPropertyBtn() {
            return this.$route.name === "Home" && this.user?.userRole !== 'Admin'
        },
        showMenu() {
            return this.$route.path.startsWith("/profile") || this.$route.name == 'Property'
        },
        showFilter() {
            return this.$route.name == 'Property'
        },
        disableProfileIcon() {
            return this.$route.path.startsWith("/profile") && false
        },
        routeChanges() {
            return this.$route
        }
    },
    watch: {
        routeChanges() {
            if (this.isNavBarOpen) {
                this.toggleNavbar()
            }
        }
    },
    methods: {
        logoutUser() {
            localStorage.clear()
            document.cookie = ""
            this.$router.replace({ name: "Home" })
            this.$store.state.user = null
        },
        goToPostProperty() {
            this.$router.push({ name: "Add Property" })
        },
        handleImageError(event) {
            event.target.src = require("@/assets/profile-fallback.jpg");
        },

        goToProfile() {
            if (this.user?.userRole === 'User')
                this.$router.push({ name: "Basic Profile" })
        },
        goToHome() {
            this.$router.push({ name: "Home" })
        },
        toggleGoogleLoginPopup() {
            this.showGoogleLoginPopup = !this.showGoogleLoginPopup
        },
        toggleNavbar() {
            document.body.classList.toggle("custom-nav-open")
            this.isNavBarOpen = !this.isNavBarOpen
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
    z-index: 1000;

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

        @media screen and (max-width:500px) {
            gap: 1em;
        }


        button {
            border: none;
            outline: none;
            background: none;
            cursor: pointer;
        }

        .profile-icon {
            display: flex;
            position: relative;

            img {
                width: 2.5em;
                aspect-ratio: 1;
                border-radius: 50%;
                user-select: none;
                object-fit: cover;
                object-position: top;
            }
        }

        .profile-icon.isAdmin:hover .logout-admin {
            display: block;
        }
        
        .logout-admin {
            display: none;
            position: absolute;
            top: calc(100%);
            right: 0;
            padding: .5em 1em;
            background: white;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.596);
            border-radius: .25em;
        }

        .post-property-btn {
            background: var(--primary-color);
            color: white;
            font-weight: 500;
            font-size: .9em;
            border-radius: .2em;
            padding: .3em 1em;
            font-family: inter;
            white-space: nowrap;

            @media screen and (max-width: 500px) {
                display: none;
            }
        }

        .login-btn {
            font-weight: 500;
        }

        .nav-icon {

            display: none;
            justify-content: center;
            height: 1.5em;
            align-self: center;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            img.close {
                width: 1.7em
            }

            img.filter {
                width: 1.6em
            }

            @media screen and (max-width: 768px) {
                display: flex !important;
            }
        }
    }
}
</style>
