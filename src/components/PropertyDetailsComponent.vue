<template>
    <div class="prop-details-container">
        <div class="left" :class="{ noImages: property?.files?.length == 0 }">
            <el-carousel v-if="property?.files?.length > 0" effect="dark" indicator-position="none"
                style="height: 100%;" autoplay arrow="always" :motion-blue="true">
                <el-carousel-item :key="image" v-for="image in property.files">
                    <img class="property-media" v-if="image.fileType == 'Image'" :src="image.fileUrl" />
                    <video muted class="property-media" v-else :src="image.fileUrl" autoplay></video>
                </el-carousel-item>
            </el-carousel>
            <div v-else>
                <img class="property-media" :src="require('@/assets/image-not-found.jpg')" alt="">
            </div>
        </div>
        <div class="right">

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
            <div v-if="details.amenitiesLeft?.length > 0 || details.amenitiesRight?.length > 0" class="section">
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
            <div v-if="!isOwner" class="section">
                <div class="section-title">
                    <span>Seller Details</span>
                    <button v-loading="chatWithSellerLoading" :disabled="chatWithSellerLoading" @click="chatWithSeller"
                        v-if="!isAdmin && property.sellerDetails">
                        <el-tooltip effect="dark" content="Chat with the seller" placement="top-start">
                            <img class="chat-icon" :src="require('@/assets/message-icon.svg')" alt="">
                        </el-tooltip>
                    </button>
                </div>
                <div class="section-content">
                    <div v-if="property.sellerDetails" class="properties-column">
                        <div class="property-row">
                            <div class="label">Seller Name:</div>
                            <div class="value">{{ property.sellerDetails.name }}</div>
                        </div>
                        <div class="property-row">
                            <div class="label">Seller Mobile:</div>
                            <div class="value">{{ `${property.sellerDetails.countryCode}
                                ${property.sellerDetails.phoneNumber}` }}</div>
                            <div v-if="property.sellerDetails.phoneNumberVerified" class="verified">
                                <img :src="require('@/assets/verified.svg')" alt="">
                            </div>
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
                        <GoogleMap :latitude="property.locationLat" :longitude="property.locationLon" :editable="false"
                            :getLatLonRequest="false" />
                    </div>
                </div>
            </div>
            <div v-if="property.tags?.length > 0" class="section">
                <div class="section-title">
                    Tags
                </div>
                <div class="tag-container section-content">
                    <el-tag effect="light" size="default" type="primary" v-for="tag in property.tags">{{ tag }}</el-tag>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { PropertyDetailsCardData } from '@/utilities/PropertyCardData';
import GoogleMap from './GoogleMap.vue';
import axiosInstance from '@/axiosInterceptor';

export default {
    components: {
        GoogleMap
    },
    props: [
        "isOwner",
        "property",
        "isAdmin"
    ],
    data() {
        return {
            chatWithSellerLoading: false
        }
    },
    methods: {

        chatWithSeller() {

            this.chatWithSellerLoading = true

            axiosInstance.post("/api/v1/user/conversation", {
                propertyId: this.property.propertyId
            })
                .then(res => {
                    this.$router.push({ name: "Chat Window", params: { conversationId: res.data.conversationId } })
                })
                .catch(err => {
                    // console.log(err);
                })
                .finally(() => {
                    this.chatWithSellerLoading = false
                })

        }
    },
    computed: {
        details() {

            if (!this.property) return;
            const { basicRight, basicLeft, amenitiesLeft, amenitiesRight } = PropertyDetailsCardData(this.property)
            return { basicRight, basicLeft, amenitiesLeft, amenitiesRight }

        },
    }
}

</script>

<style scoped lang="scss">
.special-row {
    background: red;
}

.prop-details-container {
    flex: 1;
    width: 100%;
    overflow: auto;
    background: white;
    border: .25em;
    border-radius: .25em;
    display: flex;
    padding: 2em 0 2em 2em;

    @media screen and (max-width: 768px) {
        padding: 0;
    }

    .left {
        width: min(30em, 40%);
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
        padding: 0 1.5em;

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

                button {
                    display: flex;
                    border: none;
                    background: none;
                    padding: 0;
                    width: 2.8em;

                    .chat-icon {
                        width: 100%;
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

                    .vue-map-container div:first-child div:nth-child(2n) {
                        display: none;
                    }
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

                    .verified {
                        display: flex;

                        img {
                            width: 1em;
                        }
                    }
                }
            }

            .tag-container {
                display: flex;
                flex-wrap: wrap;
                gap: .5em;
            }
        }

        @media screen and (max-width: 768px) {
            padding: 1em;
        }

    }

    @media screen and (max-width:768px) {
        flex-direction: column;
        width: 100%;
        scrollbar-width: none;


        .left {
            width: 100%;
            padding: 1em 1em 0 1em;

        }

        .left.noImages {
            width: 100%;
            height: inherit;
            object-fit: contain;
        }

        .right {
            overflow: visible;
        }
    }
}

.listed-property-details .prop-details-container {
    padding-top: 1em;
}
</style>