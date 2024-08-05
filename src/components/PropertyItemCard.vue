<template>
    <div v-if="isAdmin" class="special-row">
        <el-switch v-model="property.isApproved" :before-change="getConfirmation" />
    </div>
    <div v-if="isMyListings && property.isApproved === false" class="special-row">
        <el-tag size="large" class="property-approval-warning" type="danger">
            Property is will be published once Admin approves.
        </el-tag>
    </div>
    <div class="property-item-card-wrapper" @click="redirectFunction">
        <div class="left">
            <img v-if="thumbnail && thumbnail.fileType === 'Image'" :src="thumbnail.fileUrl" />
            <video v-else-if="thumbnail && thumbnail.fileType === 'Video'" :src="thumbnail.fileUrl" autoplay
                muted></video>
            <img v-else :src="require('@/assets/image-not-found.jpg')" />
        </div>
        <div class="right">
            <div class="prop-desc">
                {{ property.description }}
            </div>
            <div class="prop-highlight-tag">
                <el-tag type="success" effect="light">{{ property.listingType }}</el-tag>
                <el-tag v-if="property.priceNegotiable" type="warning" effect="light">Price Negotiable</el-tag>
                <el-tag v-if="property?.propertyStatus === 'Inactive'" type="error" effect="light">Inactive</el-tag>
                <el-tag v-if="property.hostelDetails?.genderPreference" type="primary" effect="light">{{
                    property.hostelDetails?.genderPreference }}</el-tag>
            </div>
            <div class="date-container">
            </div>
            <div class="property-details posted-on">
                <div class="properties-column">
                    <div class="property-row" >
                        <div class="label">Posted On:</div> 
                        <div class="value">{{ parseDateString(property.postedOn) }}</div>
                    </div>
                </div>
            </div>
            <div class="property-details">
                <div class="properties-column">
                    <div class="property-row" v-for="property in leftProperties">
                        <div class="label">{{ property.label }}:</div>
                        <div class="value">{{ property.value }}</div>
                    </div>
                </div>
                <div class="properties-column">
                    <div class="property-row" v-for="property in rightProperties">
                        <div class="label">{{ property.label }}:</div>
                        <div class="value">{{ property.value }}</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
import axiosInstance from '@/axiosInterceptor';
import { parseDateString } from '@/utilities/ParseDate';
import { PropertyItemCardData } from '@/utilities/PropertyCardData';
import { ElMessage, ElMessageBox } from 'element-plus';




export default {
    props: [
        "property",
        "redirectFunction",
        "isAdmin",
        "isMyListings"
    ],
    data() {
        return {
            leftProperties: [],
            rightProperties: [],
            parseDateString,
        }
    },
    computed: {
        thumbnail() {

            if (this.property.files.length === 0) return false
            return this.property.files[0];
        }
    },
    methods: {
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
        }
    },
    mounted() {
        const { left, right } = PropertyItemCardData(this.property)
        this.leftProperties = left
        this.rightProperties = right
    }
}

</script>

<style scoped lang="scss">
.special-row {
    padding: .5em 1em 0;

    .property-approval-warning {
        width: 100%;
    }
}

.property-item-card-wrapper {
    display: flex;
    gap: 1em;
    padding: 1em;
    border-bottom: 1px solid rgb(189, 189, 189);
    align-items: flex-start;
    flex-wrap: wrap;
    cursor: pointer;

    .left {
        display: flex;
        max-height: 15em;

        img,
        video {
            width: 17em;
            object-fit: cover;
            border-radius: .25em;
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        gap: .5em;
        flex: 1;


        .prop-desc {
            color: rgb(108, 108, 108);
            font-size: .95em;
        }

        .prop-highlight-tag {
            display: flex;
            gap: .5em;
        }

        .property-details {
            width: min(100%, 40em);
            display: flex;
            flex-wrap: wrap;
            margin-top: 1em;
            gap: 2em;
            row-gap: .5em;

            .properties-column {
                display: flex;
                flex-direction: column;
                gap: .5em;
                flex: 1;
            }

            .property-row {
                display: flex;
                gap: .5em;


                .label {
                    white-space: nowrap;
                    font-size: .8em;
                    color: rgb(87, 87, 87)
                }

                .value {
                    font-size: .9em;
                    font-weight: 500;
                    color: rgb(66, 66, 66);
                }
            }
        }

        .posted-on {
            margin-top: 0;

            .value {
                font-size: .8em !important;
            }
        }

    }

    @media screen and (max-width:1000px) {
        flex-direction: column;
        padding: 1em;

        .left {
            width: 100%;
            justify-content: center;
            max-height: fit-content;

            img,
            video {
                width: 100%;
                height: 100%;
                max-height: 15em;
                object-fit: contain;
            }
        }

        .right {
            width: 100%;
        }
    }

}
</style>