<template>
    <div class="prop-details-wrapper">
        <div class="prop-details-header">
            <div class="header-left">
                <span class="back-btn" @click="$router.go(-1)">
                    <img :src="require('@/assets/left-arrow-grey.svg')" alt="">
                </span>
                <span>Property Details</span>
            </div>
            <div v-if="!isAdmin" class="header-right">
                <el-tooltip v-if="!propertyLoading && property?.sellerDetails == null" class="box-item" :disabled="userSessionDetails !== null"
                    effect="dark" content="Login to request details" placement="bottom-start">
                    <button v-if="property?.sellerDetails == null"
                        :disabled="propertyRequestLoading || !userSessionDetails" @click="requestProperty"
                        class="request-property-btn">
                        <span>Request Property Details</span>
                        <span>
                            <img v-if="!propertyRequestLoading" :src="require('@/assets/request-icon.svg')" alt="">
                            <img v-else :src="require('@/assets/loader.svg')" alt="">
                        </span>
                    </button>
                </el-tooltip>
            </div>
            <div v-if="isAdmin && property" class="special-row">
                <el-switch v-model="property.isApproved" :before-change="getConfirmation"
                    style=" --el-switch-off-color: black" />
            </div>
        </div>
        <PropertyDetailsComponent :propertyLoading="propertyLoading" :property="property" :is-owner="false" :isAdmin="isAdmin" />

    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import PropertyDetailsComponent from '@/components/PropertyDetailsComponent.vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

export default {
    components: {
        PropertyDetailsComponent
    },
    data() {
        return {
            propertyLoading: true,
            property: null,
            propertyRequestLoading: false
        }
    },
    computed: {
        userSessionDetails() {
            return this.$store.state.user
        },
        isAdmin() {
            return this.$store.state.user?.userRole === "Admin"
        }
    },
    watch: {
        userSessionDetails() {
            this.getPropertyDetails();
        }
    },
    methods: {
        getPropertyDetails() {
            this.propertyLoading = true

            const url = this.isAdmin ? `/api/v1/admin/property/${this.$route.params.propertyId}` : `/api/v1/property/${this.$route.params.propertyId}`

            axiosInstance(url)
                .then(res => {
                    this.property = res.data
                })
                .catch(err => {
                    if (err?.response?.status === 400) {
                        this.$router.replace({ name: "Property" })
                    }
                })
                .finally(() => {
                    this.propertyLoading = false
                })
        },
        requestProperty() {
            this.propertyRequestLoading = true

            axiosInstance.post("/api/v1/property/request", {
                propertyId: this.$route.params.propertyId
            })
                .then(res => {
                    this.getPropertyDetails()
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
                .finally(() => {
                    this.propertyRequestLoading = false
                })
        },
        getConfirmation() {

            const nextStatus = this.property.isApproved ? "Disapproved" : "Approved"

            ElMessageBox({
                message: `Sure want to ${this.property.isApproved ? 'Disapprove' : 'Approve'}`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
                closeOnClickModal: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        instance.confirmButtonText = 'Loading...'
                        axiosInstance.put("/api/v1/admin/property", {
                            isapproved: !this.property.isApproved,
                            propertyid: this.property.propertyId
                        })
                            .then(res => {
                                this.property.isApproved = !this.property.isApproved
                                ElMessage({
                                    type: 'success',
                                    message: `Property ${nextStatus}`,
                                })
                            })
                            .catch(err => {
                                ElMessage({
                                    type: 'error',
                                    message: "Something went wrong",
                                })
                            })
                            .finally(() => {
                                done()
                            })

                    } else {
                        done()
                    }
                },
            }).then((action) => {

            })
                .catch(err => {
                })

            return false
        },
    },
    beforeMount() {
        this.getPropertyDetails()
    }
}
</script>

<style lang="scss" scoped>
.prop-details-wrapper {
    flex: 1;
    overflow: hidden;
    padding: 1em 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .prop-details-header {
        display: flex;
        justify-content: space-between;

        .header-left {
            display: flex;
            gap: 1em;

            .back-btn {
                cursor: pointer;
            }

            span {
                display: flex;
                align-items: center;
                font-weight: 500;
                color: #383838;

                img {
                    width: 1em;
                }
            }
        }

        .header-right {

            .request-property-btn {
                display: flex;
                align-items: center;
                color: white;
                font-weight: 500;
                gap: .5em;
                background: var(--primary-color);
                padding: .5em 1em;
                font-size: .75em;
                border-radius: .25em;
                user-select: none;
                cursor: pointer;
                border: none;
                font-family: inter;

                img {
                    height: 1.4em;
                }
            }

            .request-property-btn:disabled {
                background: var(--primary-color);
                opacity: .7;
                cursor: default;
            }

        }

    }

}
</style>