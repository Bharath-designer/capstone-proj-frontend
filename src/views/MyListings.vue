<template>
    <div v-loading="listingsLoading" class="my-listings-wrapper">
        <PropertyItemCard :isMyListings="true" v-for="propertyItem in listings"
            :redirectFunction="() => $router.push({ name: 'ListedPropertyDetails', params: { propertyId: propertyItem.propertyId } })"
            :property="propertyItem" />
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
            listingsLoading: true,
            listings: []
        }
    },
    methods: {
        getMyListings() {
            this.listingsLoading = true

            axiosInstance("/api/v1/user/listings")
                .then(res => {
                    this.listings = res.data
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.listingsLoading = false
                })
        }
    },
    beforeMount() {
        this.getMyListings()
    }
}
</script>

<style scoped lang="scss">
.my-listings-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;
}
</style>
