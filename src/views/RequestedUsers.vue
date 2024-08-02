<template>
    <div class="requested-user-wrapper">
        <div v-for="user in requestedUsers" class="user-item">
            <div class="header">
                <div class="username">
                    {{ user.userName }}
                    <div class="email">{{ user.email }}</div>
                </div>
                <div v-loading="user.chatLoading" @click="chatWithUser(user)" class="message-icon">
                    <el-tooltip effect="dark" content="Chat with the user" placement="top-start">
                        <img class="chat-icon" :src="require('@/assets/message-icon.svg')" alt="">
                    </el-tooltip>
                </div>
            </div>
            <div class="inp-row">
                <div class="label">Mobile: </div>
                <div class="value">{{ user.mobileNumber ? `${user.countryCode} ${user.mobileNumber}` : 'Not Added' }}
                </div>
                <div v-if="user.isPhoneNumberVerified" class="verified">
                    <img :src="require('@/assets/verified.svg')" alt="">

                </div>
            </div>
            <div class="inp-row">
                <div class="label">Requested On: </div>
                <div class="value">{{ parseDateString(user.viewedOn) }}
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import { parseDateString } from '@/utilities/ParseDate';

export default {
    data() {
        return {
            requestedUsers: [],
            requestedUsersLoading: true,
            parseDateString,

        }
    },
    methods: {
        getDetails() {
            this.requestedUsersLoading = true
            axiosInstance(`/api/v1/user/listings/users/${this.$route.params.propertyId}`)
                .then(res => {
                    this.requestedUsers = res.data
                })
                .catch(err => {
                    if (err?.response.status === 400) {
                        this.$router.replace({ name: "My Listings" })
                    }
                })
                .finally(err => {
                    this.requestedUsersLoading = false
                })
        },
        chatWithUser(user) {
            user.chatLoading = true
            axiosInstance.post("/api/v1/user/seller/conversation", {
                userId: user.userId,
                propertyId: this.$route.params.propertyId
            })
                .then(res => {
                    this.$router.push({ name: "Chat Window", params: { conversationId: res.data.conversationId } })
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    user.chatLoading = false
                })

        }
    },
    beforeMount() {
        this.getDetails()
    }
}
</script>

<style scoped lang="scss">
.requested-user-wrapper {
    flex: 1;
    overflow: auto;

    .user-item {
        padding: 1em 2em;
        border-bottom: 1px solid rgb(168, 168, 168);
        transition: .4s ease;

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1em;

            .username {
                font-weight: 500;
                color: rgb(59, 59, 59);
            }

            .message-icon {
                width: 2.5em;
                cursor: pointer;
                display: flex;

            }

        }

        .email {
            font-size: .85em;
            color: rgb(78, 78, 78);
            margin-top: .3em;
            font-weight: 400;
        }

        .inp-row {
            margin-top: .5em;
            display: flex;
            align-items: center;
            gap: .5em;

            .verified {
                display: flex;

                img {
                    width: 1em;
                }
            }

            .label {
                color: rgb(99, 99, 99);
                font-size: .85em;
            }

            .value {
                font-size: .9em;
            }
        }
    }

    .user-item:hover {
        background: rgb(229, 229, 229);

    }
}
</style>