<template>
    <div v-if="!loading" class="profile-wrapper">
        <div class="profile-left-nav-container">
            <div class="top-navs">
                <router-link :to="{ name: 'BasicProfile' }" class="nav-item">My Profile</router-link>
                <router-link :to="{ name: 'MyListings' }" class="nav-item">My Listings</router-link>
                <router-link :to="{ name: 'ViewedProperties' }" class="nav-item">Viewed Properties</router-link>
                <router-link :to="{ name: 'MyChats' }" class="nav-item">My Chats</router-link>
            </div>
            <div @click="logout" class="logout-btn">
                <span>Logout</span>
                <span>
                    <img :src="require('@/assets/logout.svg')" alt="">
                </span>
            </div>
        </div>
        <div class="profile-right">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true
        }
    },
    methods: {
        logout() {
            localStorage.clear()
            document.cookie = ""
            this.$router.replace({ name: "Home" })
            this.$store.state.user = null
        }
    },
    beforeMount() {
        if (this.$store.state.user == null) {
            this.$router.replace({ name: "Home" })
            return;
        }

        this.loading = false
    }
}
</script>

<style scoped>
.profile-wrapper {

    flex: 1;
    overflow: hidden;
    display: flex;
    gap: 1em;
    padding: 1em;


    .profile-left-nav-container {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: .25em;
        width: 15em;
        overflow: hidden;


        .top-navs {
            flex: 1;
            overflow: auto;

            .nav-item {
                text-align: center;
                display: block;
                text-decoration: none;
                color: rgb(43, 43, 43);
                padding: 1em;
                font-size: .9em;
                border-bottom: 1px solid rgb(165, 165, 165);
            }
        }

        .logout-btn {
            display: flex;
            gap: .5em;
            align-items: center;
            justify-content: center;
            padding: .6em;
            background: var(--primary-color);
            color: white;
            font-weight: 500;
            cursor: pointer;

            span {
                display: flex
            }
        }

    }

    .profile-right {
        flex: 1 1 60%;
        background: white;
        border-radius: .25em;
    }

}
</style>