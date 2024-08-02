<template>
    <div class="property-item-card-wrapper" @click="redirectFunction">
        <div class="left">
            <img v-if="thumbnail" :src="thumbnail" />
            <img v-else :src="require('@/assets/image-not-found.jpg')" />
        </div>
        <div class="right">
            <div class="prop-desc">
                {{ property.description }}
            </div>
            <div class="prop-highlight-tag">
                <el-tag type="success" effect="light">{{ property.listingType }}</el-tag>
                <el-tag v-if="property.priceNegotiable" type="warning" effect="light">Price Negotiable</el-tag>
                <el-tag v-if="property.hostelDetails?.genderPreference" type="primary" effect="light">{{
                    property.hostelDetails?.genderPreference }}</el-tag>
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
import { PropertyItemCardData } from '@/utilities/PropertyCardData';




export default {
    props: [
        "property",
        "redirectFunction"
    ],
    data() {
        return {
            leftProperties: [],
            rightProperties: []
        }
    },
    computed: {
        thumbnail() {

            if (this.property.files.length == 0) return false

            for (let file of this.property.files) {
                if (file.fileType === "Image") {
                    return file.fileUrl
                }
            }

            return false;
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

        img {
            width: 17em;
            height: 100%;
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
                    font-weight: 600;
                    color: rgb(66, 66, 66);
                }
            }
        }

    }

    @media screen and (max-width:1000px) {
        flex-direction: column;
        padding: 2em 1em;

        .left {
            width: 100%;
            justify-content: center;
            max-height: fit-content;

            img {
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