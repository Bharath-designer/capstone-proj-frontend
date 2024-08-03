<template>
    <div class="add-edit-prop-wrapper">
        <div class="top-header">
            <span @click="goBack" class="back-btn">
                <img :draggable="false" :src="require('@/assets/left-arrow-grey.svg')" alt="">
            </span>
            <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="add-edit-content" v-loading="editPropertyDataLoading">
            <el-form ref="propertyForm" class="form" :model="propertyValues" label-position="top" :rules="rules"
                label-width="auto" size="default" status-icon>
                <div class="form-content">

                    <el-form-item class="form-item" v-for="(formItem, index) in formValues" :label="formItem.formLabel"
                        :prop="formItem.vModel" :key="formItem.vModel">

                        <el-input v-if="formItem.type == 'text'" v-model="propertyValues[formItem.vModel]" />
                        <el-input v-if="formItem.type == 'textarea'" :disabled="!!formItem.disabled" type="textarea"
                            v-model="propertyValues[formItem.vModel]" />

                        <el-segmented :disabled="!!formItem.disabled" type="success" v-if="formItem.type == 'segmented'"
                            :options="formItem.selectOptions" v-model="propertyValues[formItem.vModel]" />

                        <el-radio-group v-if="formItem.type == 'radio'" v-model="propertyValues[formItem.vModel]">
                            <el-radio v-for="option in formItem.selectOptions" :value="option.value">{{ option.label
                                }}</el-radio>
                        </el-radio-group>

                        <el-switch v-if="formItem.type == 'switch'" v-model="propertyValues[formItem.vModel]"
                            class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: grey" />

                        <el-select :clearable="true" :filterable="!!formItem.filterable"
                            v-if="formItem.type == 'select'" v-model="propertyValues[formItem.vModel]">
                            <el-option v-for="item in formItem.selectOptions" :key="item.value ? item.value : item"
                                :label="item.label ? item.label : item" :value="item.value ? item.value : item" />
                        </el-select>

                        <el-select :clearable="true" v-if="formItem.type == 'tag'" v-model="propertyValues.tags"
                            :multiple="true" :remote="true" :filterable="true" :allow-create="true"
                            :reserve-keyword="false" :remote-method="getTags" :loading="tagsLoading"
                            :placeholder="formItem.placeholder">
                            <el-option v-for="item in tagOptions" :key="item.value ? item.value : item"
                                :label="item.label ? item.label : item" :value="item.value ? item.value : item" />

                        </el-select>
                        <div v-if="formItem.type == 'gmap'" class="location-selector">
                            <el-button @click="getCurrentLocation">Get your current location</el-button>
                            <div class="map-container">
                                <GoogleMap :editable="true" :latitude="propertyValues.locationLat"
                                    :longitude="propertyValues.locationLon" @update="markerChanged" />
                            </div>
                        </div>

                        <div v-if="formItem.type == 'files'" class="file-upload-container">
                            <input accept="image/*,video/*" @input="handleFileUploaded" hidden type="file" multiple
                                id="file-upload-inp">
                            <label @dragover="(e) => e.preventDefault()" @drop.prevent="handleDrop"
                                for="file-upload-inp" class="drag-drop-container">
                                Drag & Drop / Click to select files
                            </label>
                            <div class="file-preview-contain">
                                <div v-for="(file, fileIndex) in filePreviewList" class="file-preview">
                                    <img v-if="file.fileType == 'Image'" :src="file.fileUrl">
                                    <video v-else :src="file.fileUrl"></video>
                                    <button @click="deleteImage(fileIndex)" type="button">
                                        <img :src="require('@/assets/close_red.svg')" alt="">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <div class="form-footer">
                    <el-form-item>
                        <el-button class="sub-btn" :disabled="propertyUpdateLoading" type="primary" @click="submitForm">
                            {{ pageTitle == 'Add Property' ? "Publish" : "Update" }}
                            <span v-if="propertyUpdateLoading">
                                <img :src="require('@/assets/loader.svg')" alt="">
                            </span>
                        </el-button>
                        <el-button v-if="pageTitle == 'Add Property'" :disabled="propertyUpdateLoading"
                            @click="resetForm">Reset</el-button>
                    </el-form-item>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import GoogleMap from '@/components/GoogleMap.vue';
import { commercialTypeOptions, currencyList, electricityOptions, foodOptions, furnitureOptions, genderOptions, listingTypeOptions, measurementUnit, propertyCategoryOptions, propertyTypeOptions, durationOptions, typesOfRoomOptions, zoningTypeOptions, productTypeOptions, waterSupplyOptions, propertyFieldList, propertyStatusOptions } from '@/utilities/AddUpdatePropertyFormValues';
import states from '@/utilities/StateList';
import { ElNotification } from 'element-plus';
import { nextTick } from 'vue';

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
                price: "2221",
                rent: "",
                deposit: "",
                rentDuration: "",
                currency: "",
                pricePerUnit: "",
                description: "",
                city: "",
                state: "",
                locationLat: 15.639866700859955,
                locationLon: 77.70642122732785,
                priceNegotiable: false,
                typesOfRooms: "",
                genderPreference: "",
                food: "",
                wifi: false,
                gatedSecurity: false,
                measurementUnit: "",
                length: "",
                width: "",
                height: "",
                floorCount: "",
                roomCount: "",
                hallAndKitchenAvailable: false,
                restroomCount: "",
                waterSupply: "",
                electricity: "",
                carParkingHouse: false,
                carParkingCommercial: "",
                furnishingDetails: "",
                commercialType: "",
                zoningType: "",
                productType: "",
                manufacturer: "",
                warrantyPeriod: "",
                warrantyUnit: "",
                propertyStatus: "",
                tags: []
            },
            warrentPeriodObj: {
                formLabel: "Warranty Period",
                vModel: "warrantyPeriod",
                type: "text",
            },
            rules: {
                propertyType: [
                    { required: true, message: 'Please select property type', trigger: 'change' },
                ],
                propertyCategory: [
                    { required: true, message: 'Please select property category', trigger: 'blur' },
                ],
                listingType: [
                    { required: true, message: 'Please select listing type', trigger: 'change' },
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
                locationLat: [
                    { required: true, message: 'Please select location on map', trigger: 'blur' },
                ],
                typesOfRooms: [
                    { required: true, message: 'Please select room type', trigger: 'blur' },
                ],

                genderPreference: [
                    { required: true, message: 'Please select gender preference', trigger: 'blur' },
                ],
                food: [
                    { required: true, message: 'Please select food preference', trigger: 'blur' },
                ],
                floorCount: [
                    { required: true, message: 'Please enter floor count, Enter \'0\' if only ground floor', trigger: 'blur' },
                    { message: 'FloorCount should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },

                ],
                carParkingCommercial: [
                    { required: true, message: 'Please enter car parking count, Enter \'0\' if not available', trigger: 'blur' },
                    { message: 'Car parking should contain only numbers', trigger: 'blur', pattern: /^\d+$/ },

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
                restroomCount: [
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
                tags: [
                    {
                        validator(rule, value, callback, source, options) {
                            const errors = [];
                            if (value.length === 0) {
                                errors.push("Tags should contain atleast one tag")
                            }
                            return errors;
                        }, trigger: 'change'
                    }],

            },
            tagOptions: [],
            tagsLoading: false,
            uploadedFileLink: [],
            filePreviewList: [],
            formDataFile: [],
            filesToRemove: [],
            propertyUpdateLoading: false,
            editPropertyDataLoading: false,
            defaultValuesUpdated: false,
            tagsCopy: []
        }
    },
    computed: {
        pageTitle() {
            return this.$route.name
        },
        formValues() {
            const data = []

            if (this.pageTitle === 'Add Property') {

                data.push({
                    formLabel: "Property Type",
                    vModel: "propertyType",
                    type: "segmented",
                    selectOptions: propertyTypeOptions
                })

                if (this.propertyValues.propertyType == "Residential") {
                    data.push({
                        formLabel: "Property Category",
                        vModel: "propertyCategory",
                        type: "segmented",
                        selectOptions: propertyCategoryOptions
                    })
                }
            } else {

                data.push({
                    formLabel: "Property Type",
                    vModel: "propertyType",
                    type: "segmented",
                    disabled: true,
                    selectOptions: propertyTypeOptions
                })

                if (this.propertyValues.propertyType == "Residential") {
                    data.push({
                        formLabel: "Property Category",
                        vModel: "propertyCategory",
                        type: "segmented",
                        disabled: true,
                        selectOptions: propertyCategoryOptions
                    })
                }

                data.push({
                    formLabel: "Property Status",
                    vModel: "propertyStatus",
                    type: "select",
                    selectOptions: propertyStatusOptions
                })
            }

            data.push({
                formLabel: "Listing Type",
                vModel: "listingType",
                type: "radio",
                selectOptions: listingTypeOptions
            })

            if (this.propertyValues.listingType == "Sale") {
                data.push({
                    formLabel: "Price",
                    vModel: "price",
                    type: "text",
                })
            }

            if (this.propertyValues.propertyType == 'Land') {


                if (this.propertyValues.listingType == "Sale") {
                    data.push({
                        formLabel: "Price Per Unit",
                        vModel: "pricePerUnit",
                        type: "select",
                        selectOptions: measurementUnit

                    })
                }

            }

            if (this.propertyValues.listingType == "Rent") {
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

            if (this.pageTitle === 'Add Property') {

                data.push({
                    formLabel: "Description",
                    vModel: "description",
                    type: "textarea",
                })
            } else {
                data.push({
                    formLabel: "Description",
                    vModel: "description",
                    type: "textarea",
                    disabled: true
                })
            }

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
                vModel: "locationLat",
                type: "gmap",
            })

            data.push({
                formLabel: "Price Negotiable",
                vModel: "priceNegotiable",
                type: "switch",
            })

            if (this.propertyValues.propertyCategory == 'Hostel') {
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
                    vModel: "food",
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

            if (this.propertyValues.propertyCategory == 'House') {
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
                    vModel: "restroomCount",
                    type: "text",
                })
                data.push({
                    formLabel: "Water Supply",
                    vModel: "waterSupply",
                    type: "select",
                    selectOptions: waterSupplyOptions
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
                    vModel: "carParkingHouse",
                    type: "switch",
                })
                data.push({
                    formLabel: "Furnishing Details",
                    vModel: "furnishingDetails",
                    type: "select",
                    selectOptions: furnitureOptions
                })
            }

            if (this.propertyValues.propertyType == 'Commercial') {
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
                    vModel: "restroomCount",
                    type: "text",
                })
                data.push({
                    formLabel: "Water Supply",
                    vModel: "waterSupply",
                    type: "select",
                    selectOptions: waterSupplyOptions
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
                    vModel: "carParkingCommercial",
                    type: "text",
                })
            }


            if (this.propertyValues.propertyType == 'Land') {
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

            if (this.propertyValues.propertyType == 'Product') {
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
                data.push(this.warrentPeriodObj)
            }

            if (this.propertyValues.warrantyPeriod != 0) {
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
                type: "tag",
                multiple: true,
                placeholder: "Search/Create tags"
            })


            data.push({
                formLabel: "Upload Files",
                type: "files",
            })


            return data;
        }

    },
    watch: {
        'propertyValues.propertyType'(newValue) {
            if (!this.defaultValuesUpdated) return;

            if (newValue !== 'Residential') {
                this.propertyValues.propertyCategory = ""
            }

            this.propertyValues.width = ""
            this.propertyValues.length = ""
            this.propertyValues.height = ""
            this.propertyValues.measurementUnit = ""
        },
        'propertyValues.listingType'(newValue) {

            if (!this.defaultValuesUpdated) return;

            this.propertyValues.price = ""
            this.propertyValues.rent = ""
            this.propertyValues.pricePerUnit = ""
            this.propertyValues.rentDuration = ""
        }

    },
    methods: {
        goBack() {
            if (this.pageTitle == "Add Property") {
                this.$router.go(-1)
            } else {
                this.$router.push({ name: "ListedPropertyDetails" })
            }
        },
        getRemovedTags() {
            const originalTags = this.tagsCopy
            const currentTags = this.propertyValues.tags
            const removedTags = originalTags.filter(tag => !currentTags.includes(tag));
            return removedTags;

        },
        getAndUpdateData() {

            this.editPropertyDataLoading = true
            axiosInstance(`/api/v1/user/listings/${this.$route.params.propertyId}`)
                .then(res => {
                    let propertyData = res.data

                    if (propertyData.propertyType === 'Residential') {
                        if (propertyData.propertyCategory === 'House') {
                            propertyData = { ...propertyData, ...propertyData.houseDetails }
                            propertyData.carParkingHouse = propertyData.houseDetails.carParking
                        }
                        if (propertyData.propertyCategory === 'Hostel') {
                            propertyData = { ...propertyData, ...propertyData.hostelDetails }
                        }
                    }
                    if (propertyData.propertyType === 'Commercial') {
                        propertyData = { ...propertyData, ...propertyData.commercialDetails }
                        propertyData.carParkingCommercial = propertyData.commercialDetails.carParking
                    }
                    if (propertyData.propertyType === 'Land') {
                        propertyData = { ...propertyData, ...propertyData.landDetails }
                    }
                    if (propertyData.propertyType === 'Product') {
                        propertyData = { ...propertyData, ...propertyData.productDetails }
                    }

                    propertyFieldList.forEach(propField => {
                        if (propertyData[propField] !== null && propertyData[propField] !== undefined) {
                            this.propertyValues[propField] = propertyData[propField]
                        }
                    })

                    this.propertyValues.tags = propertyData.tags
                    this.tagsCopy = [...propertyData.tags]
                    this.propertyValues['propertyStatus'] = propertyData['propertyStatus']

                    this.filePreviewList = [...propertyData.files]
                    this.uploadedFileLink = [...propertyData.files]

                    nextTick(() => {
                        this.defaultValuesUpdated = true
                    })

                })
                .catch(err => {
                    if (err?.response?.status === 400) {
                        this.$router.replace({ name: "My Listings" })
                    }
                })
                .finally(() => {
                    this.editPropertyDataLoading = false
                })

        },
        deleteImage(index) {

            const imagesAlreadyUploadLength = this.uploadedFileLink.length

            if (index < imagesAlreadyUploadLength) {
                this.filesToRemove.push(this.uploadedFileLink[index].fileUrl)
                this.uploadedFileLink.splice(index, 1)
            } else {
                const tempIndex = index - imagesAlreadyUploadLength
                this.formDataFile.splice(tempIndex, 1)
            }

            this.filePreviewList.splice(index, 1)
        },
        async submitForm() {
            const formEl = this.$refs.propertyForm
            await formEl.validate((valid, fields) => {
                if (valid) {
                    this.propertyUpdateLoading = true
                    const formdata = new FormData()

                    propertyFieldList.forEach(field => {

                        if (field === 'carParkingCommercial') {
                            if (this.propertyValues.propertyType === 'Commercial') {
                                formdata.append('carParking', this.propertyValues[field])
                            }
                        } else if (field === 'carParkingHouse') {
                            if (this.propertyValues.propertyType === 'Residential') {
                                formdata.append('carParking', this.propertyValues[field])
                            }
                        }
                        else if (this.propertyValues[field] !== "") {
                            formdata.append(field, this.propertyValues[field])
                        }
                    })

                    this.propertyValues.tags.forEach(tag => {
                        formdata.append("tags", tag)
                    })

                    this.formDataFile.forEach(file => {
                        formdata.append("files", file)
                    })

                    let endpoint = this.propertyValues.propertyType

                    if (this.propertyValues.propertyType == 'Residential') {
                        endpoint = this.propertyValues.propertyCategory
                    }

                    if (this.pageTitle == "Add Property") {

                        axiosInstance.post(`/api/v1/property/${endpoint}`, formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(res => {
                                this.resetForm()
                                this.filePreviewList = []
                                this.formDataFile = []
                                this.$router.push({ name: "My Listings" })
                            })
                            .catch(err => {
                                const errorObj = err.response.data.error

                                ElNotification({
                                    message: errorObj ? errorObj[0] : err.response.data.message,
                                    type: 'error',
                                })
                            })
                            .finally(() => {
                                this.propertyUpdateLoading = false
                            })
                    } else {

                        formdata.append("propertyId", this.$route.params.propertyId)
                        formdata.append("propertyStatus", this.propertyValues.propertyStatus)

                        this.propertyValues.tags.forEach(tag => {
                            formdata.append("tagsToBeAdded", tag)
                        })

                        const tagsToBeRemoved = this.getRemovedTags()
                        tagsToBeRemoved.forEach(tag => {
                            formdata.append("tagsToBeRemoved", tag)
                        })

                        this.filesToRemove.forEach(file => {
                            formdata.append("filesToBeRemoved", file)
                        })

                        axiosInstance.put(`/api/v1/property/${endpoint}`, formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(res => {
                                ElNotification({
                                    message: "Updated Succesfully",
                                    type: 'success',
                                })
                                // this.getAndUpdateData()
                                this.$router.push({ name: "ListedPropertyDetails" })
                            })
                            .catch(err => {
                                const errorObj = err.response.data.error

                                ElNotification({
                                    message: errorObj ? errorObj[0] : err.response.data.message,
                                    type: 'error',
                                })
                            })
                            .finally(() => {
                                this.propertyUpdateLoading = false
                            })
                    }


                }
            })
        },
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
            this.propertyValues.locationLat = values.lat
            this.propertyValues.locationLon = values.lng

        },
        resetForm() {
            const formEl = this.$refs.propertyForm
            formEl.resetFields()
        },
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        this.propertyValues.locationLon = longitude
                        this.propertyValues.locationLat = latitude
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
        },
        handleFileUploaded(e) {
            let filelist = Array.from(e.target.files);
            const maxFileSizeInBytes = 20 * 1024 * 1024; // 5 MB
            const allowedFileTypes = ['video/mp4', 'image/jpeg', 'image/jpg', 'image/png'];
            let validFiles = [];

            filelist.forEach(file => {
                if (file.size > maxFileSizeInBytes) {
                    ElNotification({
                        title: 'Error',
                        message: `File size exceeds the maximum limit of 20 MB: ${file.name}`,
                        type: 'error',
                    });
                } else if (!allowedFileTypes.includes(file.type)) {
                    ElNotification({
                        title: 'Error',
                        message: `Invalid file type. Only mp4, jpg, jpeg, and png files are allowed: ${file.name}`,
                        type: 'error',
                    });
                } else {
                    validFiles.push(file);
                }
            });

            this.formDataFile = [...this.formDataFile, ...validFiles];

            const fileBlobURL = validFiles.map(f => {
                return {
                    fileType: f.type.startsWith('image') ? 'Image' : 'Video',
                    fileUrl: URL.createObjectURL(f)
                }
            })

            this.filePreviewList = [...this.filePreviewList, ...fileBlobURL]

        },
        handleDrop(e) {
            const e_cus = {
                target: {
                    files: []
                }
            }
            e_cus.target.files = e.dataTransfer.files;
            this.handleFileUploaded(e_cus)
        }
    },
    beforeMount() {

        const isUser = this.$store.state.user?.userRole === "User"

        if (!isUser) {
            this.$router.replace({ name: "Home" })
        }

        if (this.pageTitle == 'Edit Property') {
            this.getAndUpdateData()
        } else {
            nextTick(() => {
                this.defaultValuesUpdated = true
            })
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

                .file-upload-container {
                    width: 100%;


                    .drag-drop-container {
                        width: 100%;
                        height: 10em;
                        border: 1px dashed rgb(108, 108, 108);
                        padding: 1em;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .file-preview-contain {
                        display: flex;
                        gap: .5em;
                        flex-wrap: wrap;
                        padding: 1em 0;

                        .file-preview {
                            display: flex;
                            position: relative;


                            img,
                            video {
                                height: 6em
                            }

                            button {
                                aspect-ratio: 1;
                                position: absolute;
                                top: 0;
                                right: 0;
                                border: none;
                                padding: .3em;
                                border-radius: 50%;
                                transform: translate(50%, -50%);
                                width: 1.5em;
                                height: 1.5em;
                                display: flex;
                                align-items: center;
                                z-index: 99;

                                img {
                                    width: 100%;
                                    cursor: pointer;
                                }
                            }

                        }
                    }

                }

            }

            .form-footer {
                position: relative;
                z-index: 99;
                box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.25);
                padding: 1em;
                padding-bottom: 0;

                .sub-btn {
                    display: flex;
                    gap: 1em;

                    span {
                        display: flex;

                        img {
                            width: 1em;
                        }
                    }
                }
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