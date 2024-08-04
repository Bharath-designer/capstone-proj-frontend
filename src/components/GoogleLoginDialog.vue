<template>
    <div class="dialog-wrapper" @click.self="closeDialog">
        <div class="dialog-content">
            <div class="google-login-container">
                <GoogleLogin :client-id="googleClientId" :callback="googleOAuthCallback"
                    :error="googleOAuthErrorCallback" />
            </div>
        </div>
    </div>
</template>

<script>

import "../styles/Dialog.css"
import { GoogleLogin } from "vue3-google-login";
import axios from '@/axiosInterceptor/index.js'


export default {
    components: {
        GoogleLogin
    },
    data: () => {
        return {
            googleClientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
        }
    },
    methods: {
        googleOAuthCallback(value) {
            axios.post("/api/v1/auth/google", {
                token: value.credential
            })
                .then(res => {
                    const { token, profilePic, userName, userRole } = res.data
                    localStorage.setItem("token", token)
                    this.$store.commit("updateUser", {userName, profilePic, userRole})
                    this.closeDialog()
                })
                .catch(err => {
                    // console.log(err);
                })
        },
        googleOAuthErrorCallback(error) {
            console.error('Google OAuth Error:', error);
        },
        closeDialog(event) {
            this.$emit("close")
        }
    }
}
</script>


<style lang="scss" scoped>
.google-login-container {
    display: flex;
    justify-content: center;
    padding: 2em 1em;
}
</style>