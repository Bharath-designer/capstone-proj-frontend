<template>
    <div v-if="messagesLoading" v-loading="true" class="chat-window-wrapper">
    </div>
    <div v-if="messages" class="chat-window-wrapper">
        <div class="chat-header">
            <div @click="$router.push({ name: 'My Chats' })" class="back-icon">
                <img :src="require('@/assets/left-arrow-grey.svg')" alt="">
            </div>
            <div class="profile">
                <img @error="handleImageError" :src="messages.conversationDetails.conversationProfilePic" alt="">
            </div>
            <div class="convo-name">{{ messages.conversationDetails.conversationName }}</div>
        </div>
        <div ref="chatWindow" class="chat-message-container">
            <div v-for="chat in messages.chats" class="chat" :class="{ rightAlign: chat.isSentByUser }">
                <div class="message">{{ chat.message }}</div>
                <div class="time">{{ parseDateStringWithTime(chat.createdOn) }}</div>
            </div>
        </div>
        <div class="chat-footer">
            <input @keydown.enter="sendMessage" v-model="messageText" placeholder="Enter Message to send" />
            <button @click="sendMessage">Send</button>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import { parseDateStringWithTime } from '@/utilities/ParseDate';
import { nextTick } from 'vue';

export default {
    data() {
        return {
            messages: null,
            messagesLoading: true,
            messageText: "",
            parseDateStringWithTime,
        }
    },
    watch: {
        messages() {
            this.scrollToBottom();
        }
    },
    methods: {
        handleImageError(event) {
            event.target.src = require("@/assets/profile-fallback.jpg");
        },

        scrollToBottom() {
            nextTick(() => {
                const chatWindow = this.$refs.chatWindow;
                chatWindow.scrollTop = chatWindow.scrollHeight;
            });
        },
        getMessges(id, disableLoad) {
            if (!disableLoad) {
                this.messagesLoading = true
            }
            axiosInstance(`/api/v1/user/message/${id}`)
                .then(res => {
                    res.data.chats.reverse()
                    this.messages = res.data
                })
                .catch(err => {
                    if (err?.response.status === 400) {
                        this.$router.replace({ name: "My Chats" })
                    }
                })
                .finally(() => {
                    this.messagesLoading = false
                })
        },
        sendMessage() {

            if (!this.messageText) return;

            axiosInstance.post("/api/v1/user/message",
                {
                    message: this.messageText,
                    conversationId: this.$route.params.conversationId
                }
            )
                .then(res => {
                    this.messageText = ""
                    this.getMessges(this.$route.params.conversationId, true)
                })
                .catch(err => {
                    console.log(err.response);
                })
                .finally(() => {

                })
        }
    },
    beforeMount() {
        this.getMessges(this.$route.params.conversationId)

        this.emitter.on("getConversationMessages", this.getMessges)
    }
}
</script>

<style lang="scss" scoped>
.chat-window-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .chat-header {
        display: flex;
        gap: .5em;
        padding: .5em;
        align-items: center;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        position: relative;
        z-index: 99;

        .back-icon {
            display: flex;
            margin-right: .5em;

            img {
                width: 1em;
                cursor: pointer;
            }
        }

        .profile {
            display: flex;


            img {
                width: 2.4em;
                border-radius: 50%;
                aspect-ratio: 1;
                object-fit: cover;
            }
        }

        .convo-name {
            font-weight: 500;

        }
    }

    .chat-message-container {
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: .5em;
        flex: 1;
        overflow: auto;
        scrollbar-width: none;
        scroll-behavior: smooth;

        .chat {
            display: flex;
            flex-direction: column;
            background: rgb(230, 230, 230);
            max-width: 80%;
            width: fit-content;
            padding: .5em;
            border-radius: .25em;
            gap: .5em;

            .message {
                color: rgb(45, 45, 45);
                word-wrap: anywhere;
                font-size: .95em;
            }

            .time {
                font-size: .75em;
                color: rgb(107, 107, 107);
            }
        }

        .chat.rightAlign {
            align-self: flex-end;
            align-items: flex-end;
            background: rgb(200, 254, 200);
        }

    }

    .chat-footer {
        display: flex;
        box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25);

        input,
        button {
            padding: 1em 2em;
            border-radius: 0;
            border: none;
            outline: none;
        }

        input {
            flex: 1;
        }

        button {
            cursor: pointer;
            background: #5ab87a;
            color: white;
            font-weight: 500;
        }
    }
}
</style>