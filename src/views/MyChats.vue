<template>
    <div class="chat-wrapper" :class="{ 'show-conversation': showConversation }">
        <div v-loading="conversationsLoading" v-infinite-scroll="getConversations"
            :infinite-scroll-disabled="disablePagination" class="conversation-container">
            <div @click="openMessages(conversation)" v-for="conversation in conversationList" class="conversation-item"
                :class="{ active: $route.params.conversationId == conversation.conversationId }">
                <div class="left">
                    <img @error="handleImageError" :src="conversation.conversationProfilePic" alt="">
                </div>
                <div class="right">
                    <div class="top">
                        <div class="name">
                            {{ conversation.conversationName }}
                        </div>
                        <div class="time">
                            {{ parseDateStringWithTime(conversation.lastUpdated) }}
                        </div>
                    </div>
                    <div v-if="conversation.hasUnreadMessage" class="bottom">
                        New Message
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-window-container">
            <div class="chat-window-content">
                <router-view></router-view>
            </div>
            <div class="select-preview-container">
                Select any conversation to get messages
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import { parseDateStringWithTime } from '@/utilities/ParseDate';

export default {
    data() {
        return {
            parseDateStringWithTime,
            conversationList: [],
            conversationsLoading: true,
            pageNumber: 1,
            noMoreData: false
        }
    },
    methods: {
        openMessages(conversation) {
            this.$router.push({ name: "Chat Window", params: { conversationId: conversation.conversationId } })
            this.emitter.emit("getConversationMessages", conversation.conversationId)
            conversation.hasUnreadMessage = false
        },
        getConversations() {
            this.conversationsLoading = true
            axiosInstance(`/api/v1/user/conversation?pageNumber=${this.pageNumber}`)
                .then(res => {

                    if (res.data.length === 0) {
                        this.noMoreData = true
                    }

                    this.conversationList.push(...res.data)
                    this.pageNumber++
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.conversationsLoading = false
                })
        },
        handleImageError(event) {
            event.target.src = require("@/assets/profile-fallback.jpg");
        },
        resetAndRefreshConversation() {
            this.pageNumber = 1
            this.conversationList = []
            this.noMoreData = false
            this.getConversations()
        }

    },
    computed: {
        disablePagination() {
            return this.conversationsLoading || this.noMoreData
        },
        showConversation() {
            return this.$route.name == "My Chats"
        }
    },
    beforeMount() {
        this.getConversations()

        this.emitter.on("refreshConversations", this.resetAndRefreshConversation)
    }
}
</script>

<style lang="scss" scoped>
.chat-wrapper {
    height: 100%;
    display: flex;
    overflow: auto;


    .conversation-container {
        width: 20em;
        border-right: 1px solid rgb(205, 205, 205);
        overflow: auto;
        scrollbar-width: none;
        display: flex;
        flex-direction: column;

        .conversation-item {
            display: flex;
            padding: .5em .8em;
            gap: .5em;
            border-bottom: 1px solid rgb(205, 205, 205);
            cursor: pointer;
            transition: .2s;

            .left {
                display: flex;
                align-items: flex-start;

                img {
                    width: 2.5em;
                    aspect-ratio: 1;
                    height: auto;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: .2em;
                padding: .3em;
                overflow: hidden;

                .top {
                    display: flex;
                    justify-content: space-between;
                    gap: .5em;
                    font-size: .95em;
                    overflow: hidden;

                    .name {
                        flex: 1;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: .95em;
                    }

                    .time {
                        font-size: .85em;
                        color: rgb(105, 105, 105);
                    }

                }

                .bottom {
                    color: rgb(44, 169, 44);
                    font-size: .8em;
                }
            }
        }

        .conversation-item:hover,
        .conversation-item.active {
            background: rgb(240, 240, 240);
        }

    }

    .chat-window-container {
        flex: 1;

        .select-preview-container {
            display: none;
            width: 100%;
            height: 100%;
            place-items: center;
            font-size: .95em;
            color: rgb(73, 73, 73);
        }

        .chat-window-content:empty+.select-preview-container {
            display: grid;
        }

        .chat-window-content:empty {
            display: none;
        }

        .chat-window-content {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

    }

}

@media screen and (max-width: 768px) {

    .chat-wrapper.show-conversation {

        .chat-window-container {
            display: none;
        }

        .conversation-container {
            display: flex;
            width: 100%;
        }
    }

    .chat-wrapper {

        .conversation-container {
            display: none;
        }

        .chat-window-container {
            display: flex;
        }


    }


}
</style>