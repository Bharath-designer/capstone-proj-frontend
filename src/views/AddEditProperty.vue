<template>
    <div class="add-edit-prop-wrapper">
        <div class="top-header">
            <span class="back-btn">
                <img :draggable="false" :src="require('@/assets/left-arrow-grey.svg')" alt="">
            </span>
            <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="add-edit-content">
            <el-form ref="propertyForm" class="form" :model="propertyValues" label-position="top" :rules="rules"
                label-width="auto" size="default" status-icon>
                <div class="form-content">

                    <el-form-item class="form-item" v-for="formItem in formValues" :label="formItem.formLabel"
                        :prop="formItem.vModel">

                        <el-input v-if="formItem.type == 'text'" v-model="propertyValues[formItem.vModel]" />
                        <el-input v-if="formItem.type == 'textarea'" type="textarea"
                            v-model="propertyValues[formItem.vModel]" />

                        <el-segmented type="success" v-if="formItem.type == 'segmented'"
                            :options="formItem.selectOptions" v-model="propertyValues[formItem.vModel]" />

                        <el-radio-group v-if="formItem.type == 'radio'" v-model="propertyValues[formItem.vModel]">
                            <el-radio v-for="option in formItem.selectOptions" :value="option.value">{{ option.label
                                }}</el-radio>
                        </el-radio-group>

                        <el-switch v-if="formItem.type == 'switch'" v-model="propertyValues[formItem.vModel]"
                            class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />

                        <el-select clearable v-if="formItem.type == 'select'" v-model="propertyValues[formItem.vModel]"
                            :multiple="formItem.multiple" :remote="formItem.remote" :filterable="formItem.filterable"
                            :allow-create="formItem.allowCreation"
                                :reserve-keyword="false"
                            :remote-method="formItem.remoteMethod"
                            :loading="formItem.remoteLoading" :placeholder="formItem.placeholder">
                            <el-option v-for="item in formItem.selectOptions" :key="item.value ? item.value : item"
                                :label="item.label ? item.label : item" :value="item.value ? item.value : item" />
                        </el-select>
                        <div v-if="formItem.type == 'gmap'" class="location-selector">
                            <el-button type="button" @click="getCurrentLocation">Get your current location</el-button>
                            <div class="map-container">
                                <GoogleMap :editable="true" :latitude="propertyValues.latitude"
                                    :longitude="propertyValues.longitude" @update="markerChanged" />
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <div class="form-footer">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">
                            {{ pageTitle == 'Add Property' ? "Publish" : "Update" }}
                        </el-button>
                        <el-button @click="resetForm">Reset</el-button>
                    </el-form-item>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import GoogleMap from '@/components/GoogleMap.vue';
import { commercialTypeOptions, currencyList, electricityOptions, foodOptions, furnitureOptions, genderOptions, listingTypeOptions, measurementUnit, propertyCategoryOptions, propertyTypeOptions, durationOptions, typesOfRoomOptions, zoningTypeOptions, productTypeOptions } from '@/utilities/AddUpdatePropertyFormValues';
import states from '@/utilities/StateList';
import { ElNotification } from 'element-plus';

export default {
    components: {
        GoogleMap
    },
    data() {
        return {
            propertyValues: {
                propertyType: "",
                propertyCategory: "",
                listingType: "",
                price: "",
                rent: "",
                currency: "",
                pricePerUnit: "",
                description: "",
                city: "",
                state: "",
                latitude: 15.639866700859955,
                longitude: 77.70642122732785,
                priceNegotiable: false,
                typesOfRooms: "",
                genderPreference: "",
                foodDetails: "",
                wifi: false,
                gatedSecurity: false,
                floorCount: "",
                roomCount: "",
                hallAndKitchenAvailable: false,
                restRoomCount: "",
                waterSupply: "",
                electricity: "",
                carParking: false,
                furnishingDetails: "",
                commercialType: "",
                zoningType: "",
                productType: "",
                manufacturer: "",
                warrantyPeriod: "",
                warrantyUnit: ""
            },
            rules: {
                propertyType: [
                    { required: true, message: 'Please select property type', trigger: 'blur' },
                ],
                propertyCategory: [
                    { required: true, message: 'Please select property category', trigger: 'blur' },
                ],
                listingType: [
                    { required: true, message: 'Please select listing type', trigger: 'blur' },
                ],
                price: [
                    { required: true, message: 'Please enter price', trigger: 'blur' },
                    { message: 'Price should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                currency: [
                    { required: true, message: 'Please select currency', trigger: 'blur' },
                ],
                rent: [
                    { required: true, message: 'Please enter rent', trigger: 'blur' },
                    { message: 'Rent should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                rentDuration: [
                    { required: true, message: 'Please select rent duration', trigger: 'blur' },
                ],
                description: [
                    { required: true, message: 'Please enter description', trigger: 'blur' },
                ],
                city: [
                    { required: true, message: 'Please enter city', trigger: 'blur' },
                ],
                state: [
                    { required: true, message: 'Please enter state', trigger: 'blur' },
                ],
                latitude: [
                    { required: true, message: 'Please select location on map', trigger: 'blur' },
                ],
                typesOfRooms: [
                    { required: true, message: 'Please select room type', trigger: 'blur' },
                ],

                genderPreference: [
                    { required: true, message: 'Please select gender preference', trigger: 'blur' },
                ],
                foodDetails: [
                    { required: true, message: 'Please select food preference', trigger: 'blur' },
                ],
                floorCount: [
                    { required: true, message: 'Please enter floor count, Enter \'0\' if only ground floor', trigger: 'blur' },
                    { message: 'FloorCount should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },

                ],
                roomCount: [
                    { required: true, message: 'Please enter room count', trigger: 'blur' },
                ],
                measurementUnit: [
                    { required: true, message: 'Please select measurement unit', trigger: 'blur' },
                ],
                width: [
                    { required: true, message: 'Please enter width', trigger: 'blur' },
                    { message: 'Width should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },

                ],
                length: [
                    { required: true, message: 'Please enter length', trigger: 'blur' },
                    { message: 'Length should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                height: [
                    { message: 'Height should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                roomCount: [
                    { required: true, message: 'Please enter room count. Enter \'0\' if not available.', trigger: 'blur' },
                    { message: 'Room count should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                restRoomCount: [
                    { required: true, message: 'Please enter restroom count. Enter \'0\' if not available.', trigger: 'blur' },
                    { message: 'Restroom count should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                waterSupply: [
                    { required: true, message: 'Please select water supply', trigger: 'blur' },
                ],
                electricity: [
                    { required: true, message: 'Please select electricty', trigger: 'blur' },
                ],
                furnishingDetails: [
                    { required: true, message: 'Please select furnishing details', trigger: 'blur' },
                ],
                commercialType: [
                    { required: true, message: 'Please select commercial type', trigger: 'blur' },
                ],
                zoningType: [
                    { required: true, message: 'Please select zoning type', trigger: 'blur' },
                ],
                productType: [
                    { required: true, message: 'Please select product type', trigger: 'blur' },
                ],
                manufacturer: [
                    { required: true, message: 'Please enter manufacturer', trigger: 'blur' },
                ],
                warrantyPeriod: [
                    { required: true, message: 'Please enter warranty period', trigger: 'blur' },
                    { message: 'Waranty duration should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },
                ],
                warrantyUnit: [
                    { required: true, message: 'Please enter warranty unit', trigger: 'blur' },
                ],

            },
            tagOptions: [],
            tagsLoading: false
        }
    },
    computed: {
        pageTitle() {
            return this.$route.name
        },
        formValues() {
            const data = []

            data.push({
                formLabel: "Property Type",
                vModel: "propertyType",
                type: "segmented",
                selectOptions: propertyTypeOptions
            })

            if (this.propertyValues.propertyType == "residential") {
                data.push({
                    formLabel: "Property Category",
                    vModel: "propertyCategory",
                    type: "segmented",
                    selectOptions: propertyCategoryOptions
                })
            }

            data.push({
                formLabel: "Listing Type",
                vModel: "listingType",
                type: "radio",
                selectOptions: listingTypeOptions
            })

            if (this.propertyValues.listingType == "sale") {
                data.push({
                    formLabel: "Price",
                    vModel: "price",
                    type: "text",
                })
            }


            if (this.propertyValues.listingType == "sale") {
                data.push({
                    formLabel: "Price Per Unit",
                    vModel: "pricePerUnit",
                    type: "select",
                    selectOptions: measurementUnit

                })
            }


            if (this.propertyValues.listingType == "rent") {
                data.push({
                    formLabel: "Rent",
                    vModel: "rent",
                    type: "text",
                })

                data.push({
                    formLabel: "Rent Duration",
                    vModel: "rentDuration",
                    type: "select",
                    selectOptions: durationOptions
                })

                data.push({
                    formLabel: "Deposit",
                    vModel: "deposit",
                    type: "text"
                })
            }

            if (this.propertyValues.listingType != "") {
                data.push({
                    formLabel: "Currency",
                    vModel: "currency",
                    type: "select",
                    selectOptions: currencyList
                })

            }

            data.push({
                formLabel: "Description",
                vModel: "description",
                type: "textarea",
            })
            data.push({
                formLabel: "City",
                vModel: "city",
                type: "text",
            })
            data.push({
                formLabel: "State",
                vModel: "state",
                type: "select",
                selectOptions: states,
                filterable: true
            })

            data.push({
                formLabel: "Geo Location",
                vModel: "latitude",
                type: "gmap",
            })

            data.push({
                formLabel: "Price Negotiable",
                vModel: "priceNegotiable",
                type: "switch",
            })

            if (this.propertyValues.propertyCategory == 'hostel') {
                data.push({
                    formLabel: "Type of room",
                    vModel: "typesOfRooms",
                    type: "select",
                    selectOptions: typesOfRoomOptions
                })

                data.push({
                    formLabel: "Gender Preference",
                    vModel: "genderPreference",
                    type: "select",
                    selectOptions: genderOptions
                })

                data.push({
                    formLabel: "Food Details",
                    vModel: "foodDetails",
                    type: "select",
                    selectOptions: foodOptions
                })

                data.push({
                    formLabel: "Wifi Available",
                    vModel: "wifi",
                    type: "switch",
                })

                data.push({
                    formLabel: "Gated Security Available",
                    vModel: "gatedSecurity",
                    type: "switch",
                })
            }

            if (this.propertyValues.propertyCategory == 'house') {
                data.push({
                    formLabel: "Measurement unit",
                    vModel: "measurementUnit",
                    type: "select",
                    selectOptions: measurementUnit
                })

                data.push({
                    formLabel: "Width",
                    vModel: "width",
                    type: "text",
                })
                data.push({
                    formLabel: "Length",
                    vModel: "length",
                    type: "text",
                })
                data.push({
                    formLabel: "Height",
                    vModel: "height",
                    type: "text",
                })
                data.push({
                    formLabel: "Floor Count",
                    vModel: "floorCount",
                    type: "text",
                })
                data.push({
                    formLabel: "Room Count",
                    vModel: "roomCount",
                    type: "text",
                })

                data.push({
                    formLabel: "Hall And Kitchen Available",
                    vModel: "hallAndKitchenAvailable",
                    type: "switch",
                })
                data.push({
                    formLabel: "RestRoom Count",
                    vModel: "restRoomCount",
                    type: "text",
                })
                data.push({
                    formLabel: "Water Supply",
                    vModel: "waterSupply",
                    type: "select",
                    selectOptions: foodOptions
                })

                data.push({
                    formLabel: "Electricity",
                    vModel: "electricity",
                    type: "select",
                    selectOptions: electricityOptions

                })

                data.push({
                    formLabel: "Gated Security Available",
                    vModel: "gatedSecurity",
                    type: "switch",
                })

                data.push({
                    formLabel: "Car Parking Available",
                    vModel: "carParking",
                    type: "switch",
                })
                data.push({
                    formLabel: "Furnishing Details",
                    vModel: "furnishingDetails",
                    type: "select",
                    selectOptions: furnitureOptions
                })
            }

            if (this.propertyValues.propertyType == 'commercial') {
                data.push({
                    formLabel: "Commercial Type",
                    vModel: "commercialType",
                    type: "select",
                    selectOptions: commercialTypeOptions
                })
                data.push({
                    formLabel: "Measurement unit",
                    vModel: "measurementUnit",
                    type: "select",
                    selectOptions: measurementUnit
                })

                data.push({
                    formLabel: "Width",
                    vModel: "width",
                    type: "text",
                })
                data.push({
                    formLabel: "Length",
                    vModel: "length",
                    type: "text",
                })
                data.push({
                    formLabel: "Height",
                    vModel: "height",
                    type: "text",
                })
                data.push({
                    formLabel: "Floor Count",
                    vModel: "floorCount",
                    type: "text",
                })
                data.push({
                    formLabel: "RestRoom Count",
                    vModel: "restRoomCount",
                    type: "text",
                })
                data.push({
                    formLabel: "Water Supply",
                    vModel: "waterSupply",
                    type: "select",
                    selectOptions: foodOptions
                })

                data.push({
                    formLabel: "Electricity",
                    vModel: "electricity",
                    type: "select",
                    selectOptions: electricityOptions

                })

                data.push({
                    formLabel: "Gated Security Available",
                    vModel: "gatedSecurity",
                    type: "switch",
                })

                data.push({
                    formLabel: "Car Parking Available",
                    vModel: "carParking",
                    type: "switch",
                })
            }


            if (this.propertyValues.propertyType == 'land') {
                data.push({
                    formLabel: "Measurement unit",
                    vModel: "measurementUnit",
                    type: "select",
                    selectOptions: measurementUnit
                })

                data.push({
                    formLabel: "Width",
                    vModel: "width",
                    type: "text",
                })
                data.push({
                    formLabel: "Length",
                    vModel: "length",
                    type: "text",
                })

                data.push({
                    formLabel: "Zoning Type",
                    vModel: "zoningType",
                    type: "select",
                    selectOptions: zoningTypeOptions
                })
            }

            if (this.propertyValues.propertyType == 'product') {
                data.push({
                    formLabel: "Product Type",
                    vModel: "productType",
                    type: "select",
                    selectOptions: productTypeOptions
                })
                data.push({
                    formLabel: "Manufacturer",
                    vModel: "manufacturer",
                    type: "text",
                })
                data.push({
                    formLabel: "Warranty Period",
                    vModel: "warrantyPeriod",
                    type: "text",
                })
            }

            if (this.propertyValues.warrantyPeriod > 0) {
                data.push({
                    formLabel: "Warranty Duration Type",
                    vModel: "warrantyUnit",
                    type: "select",
                    selectOptions: durationOptions
                })
            }

            data.push({
                formLabel: "Tags",
                vModel: "tags",
                type: "select",
                multiple: true,
                selectOptions: this.tagOptions,
                remote: true,
                filterable: true,
                allowCreation: true,
                remoteMethod: this.getTags,
                remoteLoading: this.tagsLoading,
                placeholder:"Search/Create tags"
            })

            return data;
        }

    },
    watch: {
        'propertyValues.propertyType'(newValue) {
            if (newValue !== 'residential') {
                this.propertyValues.propertyCategory = ""
            }
        },
        'propertyValues.listingType'(newValue) {
            this.propertyValues.price = ""
            this.propertyValues.rent = ""
            this.propertyValues.pricePerUnit = ""
        }

    },
    methods: {
        getTags(query) {
            this.tagsLoading = true
            if (!query) query = "";
            axiosInstance(`/api/v1/tags?query=${query}`)
                .then(res => {
                    this.tagOptions = res.data
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.tagsLoading = false
                })
        },
        markerChanged(values) {
            this.propertyValues.latitude = values.lat
            this.propertyValues.longitude = values.lng

        },
        resetForm() {
            const formEl = this.$refs.propertyForm
        },
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        this.propertyValues.longitude = longitude
                        this.propertyValues.latitude = latitude
                    },
                    (error) => {
                        if (error.code == error.PERMISSION_DENIED) {
                            ElNotification({
                                title: 'Permission Denied',
                                message: 'Request to location was denied',
                                type: 'error',
                            })
                        } else {
                            ElNotification({
                                message: 'Something went wrong',
                                type: 'error',
                            })
                        }
                    }
                );
            } else {
                ElNotification({
                    message: 'Geolocation is not supported by this browser ',
                    type: 'error',
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.add-edit-prop-wrapper {
    flex: 1;
    overflow: hidden;
    width: min(95%, 45em);
    margin: auto;
    padding: 1em 0 1em;
    display: flex;
    flex-direction: column;
    gap: .5em;

    .top-header {
        display: flex;
        gap: .5em;

        .page-title {
            font-weight: 500;
        }

        .back-btn {
            display: flex;

            img {
                width: 1em;
                cursor: pointer;

            }
        }

    }

    .add-edit-content {
        flex: 1;
        overflow: auto;
        background: white;
        border-radius: .25em;
        padding-bottom: 0;

        .form {
            display: flex;
            flex-direction: column;
            overflow: auto;
            height: 100%;


            .form-content {
                flex: 1;
                overflow: auto;
                scrollbar-width: none;
                padding: 1.5em;

                .location-selector {
                    width: 100%;

                    button {
                        margin-bottom: 1em;
                    }

                    .map-container {
                        width: 100%;
                    }
                }

            }

            .form-footer {
                position: relative;
                z-index: 99;
                box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25);
                padding: 1em;
                padding-bottom: 0;
            }

        }

        .form-item .el-segmented {
            // --el-segmented-item-selected-color: var(--el-text-color-primary);
            // --el-segmented-item-selected-bg-color: rgb(53, 205, 53);
            user-select: none;
        }
    }

}
</style>