<template>
    <div class="prop-details-wrapper">
        <div class="prop-details-header">
            <div class="header-left">
                <span class="back-btn" @click="$router.push({name:'Property'})">
                    <img :src="require('@/assets/left-arrow-grey.svg')" alt="">
                </span>
                <span>Property Details</span>
            </div>
            <div class="header-right">
                <el-tooltip v-if="!propertyLoading && property" class="box-item" :disabled="userSessionDetails !== null" effect="dark"
                    content="Login to request details" placement="bottom-start">
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
        </div>
        <div v-loading="propertyLoading" class="prop-details-container">
            <div v-if="!propertyLoading && property" class="left" :class="{ noImages: property?.files?.length == 0 }">
                <el-carousel v-if="property?.files?.length > 0" effect="dark" indicator-position="none"
                    style="height: 100%;" autoplay arrow="always" :motion-blue="true">
                    <el-carousel-item v-for="image in property.files">
                        <img class="property-media" v-if="image.fileType == 'Image'" :src="image.fileUrl" />
                        <video muted class="property-media" v-else :src="image.fileUrl" autoplay></video>
                    </el-carousel-item>
                </el-carousel>
                <div v-else>
                    <img class="property-media" :src="require('@/assets/image-not-found.jpg')" alt="">
                </div>
            </div>
            <div v-if="!propertyLoading && property" class="right">

                <div class="property-status-container">
                    <el-tag :type="property.propertyStatus === 'Active' ? 'success' : 'danger'" effect="plain"
                        size="large">{{ property.propertyStatus }}</el-tag>
                </div>
                <div class="prop-desc">
                    {{ property.description }}
                </div>

                <div class="section">
                    <div class="section-title">
                        Basic Details
                    </div>
                    <div class="section-content">
                        <div class="properties-column">
                            <div class="property-row" v-for="keyValueRow in details.basicLeft">
                                <div class="label">{{ keyValueRow.label }}:</div>
                                <div class="value">{{ keyValueRow.value }}</div>
                            </div>
                        </div>
                        <div class="properties-column">
                            <div class="property-row" v-for="keyValueRow in details.basicRight">
                                <div class="label">{{ keyValueRow.label }}:</div>
                                <div class="value">{{ keyValueRow.value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">
                        Amenities
                    </div>
                    <div class="section-content">
                        <div class="properties-column">
                            <div class="property-row" v-for="keyValueRow in details.amenitiesLeft">
                                <div class="label">{{ keyValueRow.label }}:</div>
                                <div class="value">{{ keyValueRow.value }}</div>
                            </div>
                        </div>
                        <div class="properties-column">
                            <div class="property-row" v-for="keyValueRow in details.amenitiesRight">
                                <div class="label">{{ keyValueRow.label }}:</div>
                                <div class="value">{{ keyValueRow.value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">
                        <span>Seller Details</span>
                        <span v-if="property.sellerDetails">
                            <el-tooltip class="box-item" effect="dark" content="Chat with the seller"
                                placement="top-start">
                                <img class="chat-icon" :src="require('@/assets/message-icon.svg')" alt="">
                            </el-tooltip>
                        </span>
                    </div>
                    <div class="section-content">
                        <div v-if="property.sellerDetails" class="properties-column">
                            <div class="property-row">
                                <div class="label">Seller Name:</div>
                                <div class="value">Sample Name</div>
                            </div>
                            <div class="property-row">
                                <div class="label">Seller Mobile:</div>
                                <div class="value">+91 983928383</div>
                            </div>
                        </div>
                        <div v-else class="seller-details-not-available">
                            Send a request to get the seller details and exact location of property,
                        </div>
                    </div>
                </div>
                <div v-if="property.locationLat" class="section">
                    <div class="section-title">
                        <span>Location Details</span>
                    </div>
                    <div class="section-content">
                        <div class="google-map-container">
                            <GoogleMap :latitude="property.locationLat" :longitude="property.locationLon"
                                :editable="false" :getLatLonRequest="false" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import GoogleMap from '@/components/GoogleMap.vue';
import { PropertyDetailsCardData } from '@/utilities/PropertyCardData';
import { ElNotification } from 'element-plus'

export default {
    components: {
        GoogleMap
    },
    data() {
        return {
            propertyLoading: true,
            property: null,
            propertyRequestLoading: false
        }
    },
    computed: {
        details() {

            if (!this.property) return;
            const { basicRight, basicLeft, amenitiesLeft, amenitiesRight } = PropertyDetailsCardData(this.property)
            return { basicRight, basicLeft, amenitiesLeft, amenitiesRight }

        },
        userSessionDetails() {
            return this.$store.state.user
        },
        updatePropertyDetails() {
            return this.$store.state.user
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
            axiosInstance(`/api/v1/property/${this.$route.params.propertyId}`)
                .then(res => {
                    this.property = res.data
                })
                .catch(err => {
                    console.log(err);
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
                    console.log(err);
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
        }
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

    .prop-details-container {
        flex: 1;
        width: 100%;
        overflow: auto;
        background: white;
        border: .25em;
        border-radius: .25em;
        display: flex;
        padding: 2em;
        gap: 2em;

        .left {
            width: 30em;
            height: 20em;

            .property-media {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: .25em;
            }
        }

        .left.noImages {
            width: 20em;
        }

        .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5em;
            overflow: auto;
            scrollbar-width: none;

            .prop-desc {
                font-size: .9em;
                color: rgb(71, 71, 71)
            }

            .section {

                border-top: 1px solid rgb(98, 98, 98);
                padding-top: 1.5em;

                .section-title {
                    font-weight: 500;
                    font-size: 1.2em;
                    color: rgb(35, 35, 35);
                    display: flex;
                    justify-content: space-between;

                    span {
                        display: flex;

                        .chat-icon {
                            width: 2em;
                            cursor: pointer;
                        }
                    }
                }

                .section-content {
                    display: flex;
                    margin-top: 1em;
                    flex-wrap: wrap;
                    column-gap: 2em;
                    row-gap: .5em;

                    .seller-details-not-available {
                        font-size: .9em;
                        color: rgb(87, 87, 87);

                    }

                    .google-map-container {
                        width: 100%;
                    }

                    .properties-column {
                        display: flex;
                        flex-direction: column;
                        gap: .5em;
                        flex: 1;

                    }

                    .property-row {
                        display: flex;
                        gap: .5em;
                        white-space: nowrap;

                        .label {
                            font-size: .8em;
                            color: rgb(87, 87, 87);
                        }

                        .value {
                            font-size: .9em;
                            font-weight: 600;
                            color: rgb(66, 66, 66);
                        }
                    }
                }
            }


        }
    }
}
</style>