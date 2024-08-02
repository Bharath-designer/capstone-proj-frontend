<template>
    <div v-if="!loading" class="profile-wrapper">
        <div class="profile-left-nav-container">
            <div class="top-navs">
                <router-link :to="{ name: 'Basic Profile' }" class="nav-item">My Profile</router-link>
                <router-link :to="{ name: 'My Listings' }" :class="{ active: makeListingsActive }" class="nav-item">My
                    Listings</router-link>
                <router-link :to="{ name: 'Requested Properties' }" class="nav-item">Requested Properties</router-link>
                <router-link :to="{ name: 'My Chats' }" class="nav-item">My Chats</router-link>
            </div>
            <div @click="logout" class="logout-btn">
                <span>Logout</span>
                <span>
                    <img :src="require('@/assets/logout.svg')" alt="">
                </span>
            </div>
        </div>
        <div class="profile-right">
            <div :class="{ hide: hideRouteName }" class="mobile-page-header">
                <span v-if="routerName === 'Property details'" class="back-btn"
                    @click="$router.push({ name: 'My Listings' })">
                    <img :src="require('@/assets/left-arrow-grey.svg')" alt="">
                </span>
                <span class="router-name">
                    {{ routerName }}
                    <span v-if="routerName == 'My Chats'" class="chat-refresh-btn">
                        <el-tooltip class="box-item" effect="dark" content="Refresh Conversations"
                            placement="top-start">
                            <img @click="refreshConversations" :src="require('@/assets/refresh-btn.svg')" alt="">
                        </el-tooltip>
                    </span>
                </span>
            </div>
            <div class="right-router-view">
                <router-view></router-view>
            </div>
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
        },
        refreshConversations() {
            this.emitter.emit("refreshConversations")
        }
    },
    computed: {
        routerName() {
            if (this.$route.path.includes("listings/"))
                return "Property details";

            if (this.$route.path.includes("/chats"))
                return "My Chats"

            return this.$route.name
        },
        makeListingsActive() {
            return this.$route.path.includes("/profile/listings")
        },
        hideRouteName() {
            return this.$route.name == "Chat Window"
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

<style scoped lang="scss">
@media screen and (max-width: 768px) {

    body .profile-left-nav-container {
        display: none !important;
        position: absolute !important;
        top: 0;
        left: 0;
        bottom: 0;
        border-radius: 0 !important;
        box-shadow: 100px 0 1000px 1000px rgba(0, 0, 0, 0.8);
        z-index: 999;
    }

    body.custom-nav-open .profile-left-nav-container {
        display: flex !important;
        pointer-events: all !important;

    }

    body.custom-nav-open .profile-wrapper {
        pointer-events: none;
    }


}
</style>

<style scoped>
.profile-wrapper {
    flex: 1;
    overflow: hidden;
    display: flex;
    gap: 1em;
    padding: 1em;
    position: relative;


    .profile-left-nav-container {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: .25em;
        overflow: hidden;
        min-width: 15em;
        max-width: 15em;

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
                border-bottom: 1px solid rgb(203, 203, 203);
            }

            .nav-item.active,
            .nav-item.router-link-active {
                font-weight: 500;
                color: red;
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
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: .8em;

        .mobile-page-header {
            font-weight: 600;
            font-size: 1.1em;
            color: rgb(48, 48, 48);
            display: flex;
            align-items: center;
            gap: .5em;

            .back-btn {
                cursor: pointer;
                display: flex;


                img {
                    width: 1em;
                }
            }
        }

        @media screen and (max-width:768px) {
            .mobile-page-header.hide {
                display: none;
            }
        }

        .right-router-view {
            flex: 1;
            overflow: hidden;
            background: white;
            border-radius: .25em;
        }

        .router-name {
            display: flex;
            align-items: center;
            gap: .5em;

            span {
                display: flex;

                img {
                    width: .9em;
                    cursor: pointer;
                }
            }
        }
    }


    @media screen and (max-width: 768px) {
        padding: 1em 0.5em;
    }

}
</style>