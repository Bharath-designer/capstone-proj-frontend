<template>
    <div class="explore-property-wrapper">
        <div class="left">
            <div class="filter-header">
                <span>Filters</span>
            </div>
            <div class="filter-content">
                <div v-for="formItem in dynamicFormRender" class="filter-element">
                    <el-form-item :label="formItem.formLabel" label-position="top" size="large">
                        <el-select clearable v-if="formItem.type == 'select'" v-model="filterData[formItem.vModel]"
                            :placeholder="'Select ' + formItem.formLabel" :multiple="formItem.multiple"
                            :remote="formItem.remote" :filterable="formItem.remote || formItem.filterable"
                            :remote-method="formItem.remoteMethod" :loading="formItem.remoteLoading">
                            <el-option v-for="item in formItem.selectOptions"
                                :key="formItem.selectValue ? item[formItem.selectValue] : item"
                                :label="formItem.selectLabel ? item[formItem.selectLabel] : item"
                                :value="formItem.selectValue ? item[formItem.selectValue] : item" />
                        </el-select>

                        <el-input v-if="formItem.type == 'text'" clearable v-model="filterData[formItem.vModel]"
                            :placeholder="'Enter ' + formItem.formLabel" />

                    </el-form-item>
                </div>
            </div>
            <div class="filter-footer">
                <span @click="clearFilters" class="clear-filter">Clear filter</span>
                <span @click="applyFilter" class="apply-filter">Apply filter</span>
            </div>
        </div>
        <div v-if="properties.length === 0 && !propertiesLoading" class="right no-properties">
            No Properties found
        </div>
        <div v-infinite-scroll="getProperties" :infinite-scroll-immediate="false" :infinite-scroll-distance="50"
            :infinite-scroll-disabled="disablePropertiesPagination" v-else class="right">
            <PropertyItemCard :isAdmin="isAdmin" v-for="propertyItem in properties" :property="propertyItem"
                :redirectFunction="() => $router.push({
                    name: 'PropertyDetails', params: {
                        propertyId:
                            propertyItem.propertyId
                    }
                })" />
            <div v-if="propertiesLoading" class="property-loader" v-loading="propertiesLoading">
            </div>
        </div>
    </div>

</template>


<script>

import axiosInstance from '@/axiosInterceptor';
import PropertyItemCard from '@/components/PropertyItemCard.vue';
import { filterSortOptions, filterPropertyTypeOptions, filterPropertyCategoryOptions, approvalOptions } from '@/utilities/FilterFormData';
import states from '@/utilities/StateList';

export default {
    components: {
        PropertyItemCard
    },
    data() {
        return {
            filterData: {
                sortBy: "datedesc",
                propertyType: "",
                propertyCategory: "",
                state: "",
                city: "",
                tags: [],
                isApproved: ""
            },
            tagOptions: [],
            tagsLoading: true,
            pageNumber: 1,
            properties: [],
            propertiesLoading: false,
            noMoreProperties: false
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
                    // console.log(err);
                })
                .finally(() => {
                    this.tagsLoading = false
                })
        },
        buildQueryString() {
            let queryString = "?"

            if (this.isAdmin) {
                if (this.filterData.isApproved === true || this.filterData.isApproved === false) {
                    queryString += `isApproved=${this.filterData.isApproved}&`
                }
            }

            if (this.filterData.city) {
                queryString += `city=${this.filterData.city}&`
            }
            if (this.filterData.state) {
                queryString += `state=${this.filterData.state}&`
            }
            if (this.filterData.propertyCategory) {
                queryString += `PropertyCategory=${this.filterData.propertyCategory}&`
            }
            if (this.filterData.propertyType) {
                queryString += `PropertyType=${this.filterData.propertyType}&`
            }
            if (this.filterData.sortBy) {
                queryString += `orderby=${this.filterData.sortBy}&`
            }
            if (this.filterData.tags.length > 0) {
                this.filterData.tags.forEach(tag => {
                    queryString += `tags=${tag}&`
                })
            }

            return queryString

        },
        syncQueryStringWithUrl(useUrlQuery) {


            if (useUrlQuery) {
                const query = this.$route.query

                if (query.isApproved !== undefined) {
                    this.filterData.isApproved = query.isApproved === 'true'
                }
                if (query.city) {
                    this.filterData.city = query.city
                }
                if (query.state) {
                    this.filterData.state = query.state
                }
                if (query.propertyCategory) {
                    this.filterData.propertyCategory = query.propertyCategory
                }
                if (query.propertyType) {
                    this.filterData.propertyType = query.propertyType
                }
                if (query.orderby) {
                    this.filterData.sortBy = query.orderby
                }
                if (query.tags) {
                    this.filterData.tags = Array.isArray(query.tags) ? query.tags : [query.tags]
                }

            } else {
                let obj = {}
                Object.keys(this.filterData).forEach(filter => {
                    if (this.filterData[filter] !== "" || this.filterData[filter] !== "") {
                        obj[filter] = this.filterData[filter]
                    }
                })
                if (obj.sortBy === "datedesc") {
                    delete obj.sortBy
                }
                this.$router.push({ query: obj })
            }

            let query = this.buildQueryString()

            query += `pagenumber=${this.pageNumber}`
            return query;

        },
        getProperties(useUrlQuery) {
            const queryString = this.syncQueryStringWithUrl(useUrlQuery)
            this.propertiesLoading = true

            const url = this.isAdmin ? `/api/v1/admin/property${queryString}` : `/api/v1/property${queryString}`

            axiosInstance(url)
                .then(res => {
                    if (res.data.length == 0) {
                        this.noMoreProperties = true
                    }
                    this.properties.push(...res.data)
                    this.pageNumber++

                })
                .catch(err => {
                    this.noMoreProperties = true
                    // console.log(err);
                })
                .finally(() => {
                    this.propertiesLoading = false
                })
        },
        applyFilter() {
            this.properties = []
            this.pageNumber = 1
            this.noMoreProperties = false
            this.getProperties()
        },
        clearFilters() {
            this.filterData = {
                sortBy: "datedesc",
                propertyType: "",
                propertyCategory: "",
                state: "",
                city: "",
                tags: [],
                isApproved: ""
            }
            this.applyFilter()
        }
    },
    computed: {
        isAdmin() {
            return this.$store.state.user?.userRole === 'Admin'
        },
        disablePropertiesPagination() {
            return this.propertiesLoading || this.noMoreProperties
        },
        dynamicFormRender() {
            const data = [

            ]

            if (!this.filterData.propertyType) {
                this.filterData.propertyCategory = ""
            }

            if (this.isAdmin) {
                data.push({
                    formLabel: "Property Approval Status",
                    vModel: "isApproved",
                    type: "select",
                    selectOptions: approvalOptions,
                    selectLabel: "label",
                    selectValue: "value"
                })
            }

            data.push({
                formLabel: "Sort by",
                vModel: "sortBy",
                type: "select",
                selectOptions: filterSortOptions,
                selectLabel: "label",
                selectValue: "value"
            })

            data.push({
                formLabel: "Property Type",
                vModel: "propertyType",
                type: "select",
                selectOptions: filterPropertyTypeOptions,
                selectLabel: "label",
                selectValue: "value"
            })


            if (this.filterData.propertyType == "residential") {
                data.push({
                    formLabel: "Property Category",
                    vModel: "propertyCategory",
                    type: "select",
                    selectOptions: filterPropertyCategoryOptions,
                    selectLabel: "label",
                    selectValue: "value"
                })

            }

            data.push({
                formLabel: "State",
                vModel: "state",
                type: "select",
                selectOptions: states,
                filterable: true
            })
            data.push({
                formLabel: "City",
                vModel: "city",
                type: "text",
            })

            data.push({
                formLabel: "Tags",
                vModel: "tags",
                type: "select",
                multiple: true,
                selectOptions: this.tagOptions,
                remote: true,
                remoteMethod: this.getTags,
                remoteLoading: this.tagsLoading
            })

            return data
        }
    },
    beforeMount() {
        this.getTags()
        this.getProperties(true)
    }

}

</script>


<style scoped lang="scss">
@media screen and (max-width: 768px) {

    body .left {
        display: none !important;
        position: absolute !important;
        top: 0;
        left: 0;
        bottom: 0;
        border-radius: 0 !important;
        box-shadow: 100px 0 1000px 1000px rgba(0, 0, 0, 0.8);
        z-index: 999;
    }

    body.custom-nav-open .left {
        display: flex !important;
        pointer-events: all !important;

    }

    body.custom-nav-open .right {
        pointer-events: none;
    }


}
</style>

<style scoped lang="scss">
.explore-property-wrapper {
    position: relative;
    flex: 1;
    overflow: hidden;
    padding: 1em;
    display: flex;
    gap: 1em;

    .left,
    .right {
        border-radius: .25em
    }

    .left {
        height: 100%;
        background: white;
        width: 20em;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .filter-header {
            padding: 1em;
            font-weight: 500;
            color: rgb(68, 68, 68);
            border-bottom: 1px solid rgb(161, 161, 161);
        }

        .filter-content {
            flex: 1;
            overflow: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1em 0;
            scrollbar-width: none;

            .filter-element {
                width: 90%;
            }
        }

        .filter-footer {
            font-weight: 500;
            padding: 1em;
            text-align: center;
            border-top: 1px solid rgb(161, 161, 161);
            user-select: none;
            cursor: pointer;
            display: flex;
            gap: .5em;
            flex-wrap: wrap;

            span {
                padding: .5em 1em;
                border-radius: .25em;
                font-size: .9em;
                white-space: nowrap;
            }

            .apply-filter {
                background: var(--primary-color);
                color: white;
                flex: 2;
            }

            .clear-filter {
                border: 1px solid rgb(144, 144, 144);
                color: rgb(58, 58, 58);
                flex: 1;
            }

        }
    }

    .right {
        height: 100%;
        background: white;
        flex: 1 0;
        flex-basis: 60%;
        overflow: auto;
        scrollbar-width: none;
        display: flex;
        flex-direction: column;

        .property-item {
            height: 200px;
        }

        .property-loader {
            height: 8em;
        }

    }

    .no-properties {
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(92, 92, 92);
    }

}
</style>