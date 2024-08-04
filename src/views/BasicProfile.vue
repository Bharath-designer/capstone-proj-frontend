<template>
    <div v-if="basicProfileLoading" v-loading="true" class="basic-profile-wrapper">
    </div>
    <div v-else-if="profileDetails" class="basic-profile-wrapper">
        <div class="profile-section">
            <div class="profile-pic">
                <img @error="handleImageError" :src="profileDetails.profilePic" alt="">
            </div>
            <div class="profile-data">
                <div class="name">{{ profileDetails.name }}</div>
                <div class="email">{{ profileDetails.email }}</div>
                <div v-if="profileDetails.countryCode" class="mobile-container">
                    <div class="label">Mobile: </div>
                    <div class="mobile">
                        {{ profileDetails.countryCode + ' ' + profileDetails.phoneNumber }}
                    </div>
                    <div v-if="profileDetails.phoneNumberVerified" class="verified">
                        <img :src="require('@/assets/verified.svg')" alt="">
                    </div>
                </div>
                <div class="add-mobile-number-container">
                    <div v-if="showAddMobileInput" class="input-container">
                        <div class="mobile-input-row">
                            <el-select class="country-code-inp" :filterable="true" size="small" v-model="countryCode"
                                placeholder="Select Country Code" type="text">
                                <el-option v-for="countryCodeitem in countryCodeList" :key="countryCodeitem"
                                    :label="countryCodeitem" :value="countryCodeitem"></el-option>
                            </el-select>

                            <el-input size="small" class="mobile-number-inp" v-model="mobileNumber" maxlength="10"
                                placeholder="Enter Mobile Number" show-word-limit type="text" />

                        </div>
                        <div class="btns">
                            <el-button size="small" dark
                                @click="showAddMobileInput = false; countryCode = ''; mobileNumber = ''">Cancel</el-button>
                            <el-button :loading="updateMobileLoader" size="small" type="primary" dark
                                @click="addMobileNumber">Update</el-button>
                        </div>

                    </div>
                    <el-button v-else size="small" dark @click="openUpdateNumberInput">Update Mobile
                        Number</el-button>
                </div>
                <div v-if="!profileDetails.phoneNumberVerified" class="not-verified-container">
                    <div v-if="showVerifyOTPInput" class="input-container">
                        <el-input size="small" v-model="otp" maxlength="4"
                            placeholder="Please enter OTP sent to your phone" show-word-limit type="text" />
                        <div class="btns">

                            <el-button size="small" dark
                                @click="showVerifyOTPInput = false; otp = ''">Cancel</el-button>
                            <el-button :disabled="otp.length !== 4" :loading="otpverificationLoading" size="small"
                                type="primary" dark @click="verifyOTP">Verify</el-button>
                        </div>

                    </div>
                    <el-button v-else size="small" dark @click="openVerifyNumberInput">Verify Mobile
                        Number</el-button>
                </div>
            </div>
        </div>
        <div class="divider-line"></div>

        <div class="subscription-section">

            <div class="section-title">
                Current Plan Details
            </div>

            <div class="subs-container current-plan-details">
                <div class="card">
                    <div class="label">Expires On</div>
                    <div class="value">{{ profileDetails.expiresOn ? parseDateString(profileDetails.expiresOn) : '-' }}
                    </div>
                </div>
                <div class="card">
                    <div class="label">Remaining Property Posting limit</div>
                    <div class="value">{{ profileDetails.availableListingCount }}</div>
                </div>
                <div class="card">
                    <div class="label">Remaining Property Viewing limit</div>
                    <div class="value">{{ profileDetails.availableSellerViewCount }}</div>
                </div>
            </div>
        </div>

        <div class="subscription-section">
            <div class="section-title">
                Subscriptions
            </div>
            <div class="subs-container">
                <div v-for="template in subsTemplate" class="subs-item">
                    <div v-if="profileDetails.subscriptionTemplateName == template.name" class="current-plan">
                        Your current plan
                    </div>
                    <div class="subs-name">
                        {{ template.name }}
                    </div>
                    <div class="limits-container">
                        <div class="limit-row">
                            <div class="limit-label">Property Posting Limit:</div>
                            <div class="limit-value">{{ template.maxListingCount }}</div>
                        </div>
                        <div class="limit-row">
                            <div class="limit-label">Property Viewing Limit:</div>
                            <div class="limit-value">{{ template.maxViewingCount }}</div>
                        </div>
                        <div v-if="template.price" class="limit-row">
                            <div class="limit-label">Price:</div>
                            <div class="limit-value">{{ template.price }} INR</div>
                        </div>
                        <div class="limit-row">
                            <div class="limit-label">Validity:</div>
                            <div v-if="template.validity" class="limit-value">{{ template.validity }} days</div>
                            <div v-else class="limit-value">No Limit</div>
                        </div>
                    </div>
                    <button :disabled="paymentLoading" v-if="template.upgradeBtn" @click="upgradePlan(template.name)"
                        class="upgrade-btn">
                        {{ paymentLoading && paymentPlan == template.name ? 'Redirecting...' : 'Upgrade' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import { countryCodeList } from '@/utilities/CountryCodeList';
import { parseDateString } from '@/utilities/ParseDate';
import { ElMessageBox, ElNotification } from 'element-plus';


export default {
    data() {
        return {
            basicProfileLoading: true,
            profileDetails: null,
            showVerifyOTPInput: false,
            otp: "",
            otpverificationLoading: false,
            showAddMobileInput: false,
            countryCode: "",
            mobileNumber: "",
            updateMobileLoader: false,
            countryCodeList,
            parseDateString,
            paymentLoading: false,
            paymentPlan: null

        }
    },
    computed: {
        subsTemplate() {

            let result = []

            if (this.profileDetails.subscriptionTemplateName == "Free") {
                result.push({
                    name: "Free",
                    maxListingCount: 1,
                    maxViewingCount: 1,
                    upgradeBtn: false,
                    validity: null,

                })
            }

            result = [...result, {
                name: "Silver",
                maxListingCount: 10,
                maxViewingCount: 10,
                price: "499",
                validity: 28,
                upgradeBtn: true,

            },
            {
                name: "Gold",
                maxListingCount: 50,
                maxViewingCount: 50,
                price: "999",
                validity: 28,
                upgradeBtn: true,

            }
            ]

            return result;
        }
    },
    methods: {
        upgradePlan(planName) {
            ElMessageBox.confirm(
                `<p>Clicking Pay Now will redirect to payment page. Continue?</p>
                    <ul style="margin-left:1em;">
                        <li>If your plan expired, you will be activated with new plan</li>
                        <li>If your current plan has some limits, that will be carry forwared to new plan with 20% deduction</li>
                    </ul>
                `,
                'Redirect warning',
                {
                    confirmButtonText: 'Pay Now',
                    cancelButtonText: 'Cancel',
                    dangerouslyUseHTMLString: true
                }
            )
                .then(() => {
                    this.paymentLoading = true;
                    this.paymentPlan = planName

                    axiosInstance.put("/api/v1/subscription", { subscriptionName: planName })
                        .then(res => {
                            location.href = res.data.paymentUrl
                        })
                        .catch(err => {
                            if (err?.response?.status == 400) {
                                const errorObj = err.response.data.error
                                ElNotification({
                                    message: errorObj ? errorObj[0] : err.response.data.message,
                                    type: "error",
                                })
                            } else {
                                ElNotification({
                                    message: "Internal server error",
                                    type: "error",
                                })
                            }
                        })
                        .finally(err => {
                            this.paymentLoading = false;
                            this.paymentPlan = null
                        })

                })
                .catch(() => {
                })


        },
        openUpdateNumberInput() {
            this.showVerifyOTPInput = false
            this.showAddMobileInput = true
        },
        openVerifyNumberInput() {
            this.showVerifyOTPInput = true
            this.showAddMobileInput = false
        },
        getBasicProfileDetails() {
            axiosInstance("/api/v1/user/profile")
                .then(res => {
                    this.profileDetails = res.data
                })
                .catch(err => {
                    // console.log(err);
                })
                .finally(() => {
                    this.basicProfileLoading = false
                })
        },
        handleImageError(event) {
            event.target.src = require("@/assets/profile-fallback.jpg");
        },
        addMobileNumber() {
            this.updateMobileLoader = true
            axiosInstance.put("/api/v1/user/phone", { countryCode: this.countryCode, phoneNumber: this.mobileNumber })
                .then(res => {
                    this.getBasicProfileDetails()
                    this.countryCode = ""
                    this.mobileNumber = ""
                    this.showAddMobileInput = false
                })
                .catch(err => {
                    // console.log(err);
                    if (err?.response?.status == 400) {
                        const errorObj = err.response.data.error
                        ElNotification({
                            message: errorObj ? errorObj[0] : err.response.data.message,
                            type: "error",
                        })
                    }
                })
                .finally(err => {
                    this.updateMobileLoader = false
                })
        },
        verifyOTP() {
            this.otpverificationLoading = true
            axiosInstance.put("/api/v1/user/verify", { otp: this.otp })
                .then(res => {
                    this.getBasicProfileDetails()
                })
                .catch(err => {
                    // console.log(err);
                    if (err?.response?.status == 400) {
                        ElNotification({
                            message: err.response.data.message,
                            type: "error",

                        })
                    }
                })
                .finally(err => {
                    this.otpverificationLoading = false
                })
        }

    },

    beforeMount() {
        this.basicProfileLoading = true
        this.getBasicProfileDetails()

        if (this.$route.query.paymentResult === "success") {
            ElNotification({
                message: "Payment is successfull",
                type: "success",
            })
        } else if (this.$route.query.paymentResult === "fail") {
            ElNotification({
                message: "Payment failed",
                type: "error",
            })
        }

        console.log(this.$route.query);
        this.$router.replace({ query: {} })

    }
}
</script>

<style scoped lang="scss">
.basic-profile-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 1em 0 2em;
    scrollbar-width: none;

    .profile-section {
        display: flex;
        flex-wrap: wrap;
        gap: 2em;
        align-items: center;
        width: min(50em, 90%);
        margin-inline: auto;
        margin-top: 2em;

        .profile-pic {
            display: flex;
            text-align: center;

            img {
                width: 10em;
                aspect-ratio: 1;
                border-radius: 50%;
                object-fit: cover;
                object-position: top;
                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.5);
            }
        }


        @media screen and (max-width: 850px) {
            flex-direction: column;
            justify-content: center;

            .profile-data {
                width: 100%;
            }
        }

        .profile-data {
            flex: 1;

            .name {
                color: #4A4A4A;
                font-weight: 600;
                font-size: 1.3em;
            }

            .email {
                color: #4A4A4A;
                font-size: .8em;
                margin-top: .5em;
            }

            .mobile-container {
                display: flex;
                margin-top: 1em;
                align-items: center;
                gap: .5em;

                .label {
                    white-space: nowrap;
                    color: #676767;
                    font-size: .85em;
                }

                .mobile {
                    color: #3d3d3d;
                    font-size: .95em;
                }

                .verified {
                    display: flex;

                    img {
                        width: 1em;
                    }
                }
            }

            .add-mobile-number-container {
                margin-top: 1em;

                .mobile-input-row {
                    display: flex;
                    gap: .5em;


                    .country-code-inp {
                        width: 15em;
                    }

                    .mobile-number-inp {}

                }

                .btns {
                    display: flex;
                    margin-top: 1em;
                }
            }

            .not-verified-container {
                margin-top: 1em;

                .input-container {
                    display: flex;

                    .btns {
                        display: flex;
                        margin-left: 1em;
                    }
                }
            }

        }
    }

    .divider-line {
        height: 1px;
        background: rgb(205, 205, 205);
        width: 100%;
        margin: 2em 0;
    }

    .subscription-section {
        width: min(90%, 60em);
        margin: auto;


        .section-title {
            color: rgb(63, 63, 63);
            font-weight: 500;
            font-size: 1.1em;
        }

        .subs-container {
            margin-top: 1em;
            display: flex;
            gap: 1em;
            justify-content: center;
            flex-wrap: wrap;

            .subs-item {
                border: 1px solid rgb(101, 101, 101);
                border-radius: .25em;
                flex: 1;
                max-width: 15em;
                display: flex;
                flex-direction: column;
                gap: 1em;
                padding: 1em;
                font-size: .9em;

                .current-plan {
                    font-weight: 500;
                    color: rgb(8, 185, 8);
                    text-align: center;
                    font-size: .85em;
                }

                .subs-name {
                    font-weight: 600;
                    font-size: 1.15em;
                    color: rgb(57, 57, 57);
                    text-align: center;
                }

                .limits-container {
                    display: flex;
                    flex-direction: column;
                    gap: .5em;
                    flex: 1;

                    .limit-row {
                        display: flex;
                        gap: .5em;

                        .limit-label {
                            white-space: nowrap;
                            color: rgb(103, 103, 103);
                            font-size: .9em;
                        }

                        .limit-value {
                            color: rgb(51, 51, 51);
                            font-weight: 500
                        }
                    }
                }

                .upgrade-btn {
                    background: var(--primary-color);
                    padding: .5em 2em;
                    border: none;
                    color: white;
                    width: fit-content;
                    border-radius: .25em;
                    margin: auto;
                    cursor: pointer;
                }
            }

        }

        .current-plan-details {
            margin-bottom: 2em;

            .card {
                border: 1px solid rgb(101, 101, 101);
                border-radius: .25em;
                padding: 1em 1.5em;
                font-size: .85em;
                display: flex;
                flex-direction: column;
                gap: .5em;
                flex: 1 0;
                flex-basis: 15em;

                .label {
                    white-space: nowrap;
                    color: rgb(92, 92, 92);
                }

                .value {
                    font-weight: 500;
                    font-size: 1.1em;
                    color: rgb(61, 61, 61);
                }
            }

        }
    }
}
</style>