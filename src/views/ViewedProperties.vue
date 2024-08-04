<template>
    <div v-loading="propertiesLoading" class="viewed-property-wrapper">
        <PropertyItemCard v-for="propertyItem in properties"
            :redirectFunction="() => $router.push({ name: 'PropertyDetails', params: { propertyId:
                propertyItem.propertyId }})"
            :property="propertyItem" />
            <div v-if="properties.length === 0" class="no-item-found">
                You have no property requested
            </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import PropertyItemCard from '@/components/PropertyItemCard.vue';

    export default {
        components: {
        PropertyItemCard
    },
    data() {
        return {
            propertiesLoading: true,
            properties: []
        }
    },
    methods: {
        getMyRequestedProperties() {
            this.propertiesLoading = true

            axiosInstance("/api/v1/user/property/requested")
                .then(res => {
                    this.properties = res.data
                })
                .catch(err => {
                    // console.log(err);
                })
                .finally(() => {
                    this.propertiesLoading = false
                })
        }
    },
    beforeMount() {
        this.getMyRequestedProperties()
    }
    }
</script>

<style scoped lang="scss">

.viewed-property-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;
}

</style>