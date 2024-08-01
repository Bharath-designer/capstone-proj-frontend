<template>
    <div class="listed-property-details">
        <PropertyDetailsComponent v-if="propertyDetails" :property="propertyDetails" :isOwner="true" />
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';
import PropertyDetailsComponent from '@/components/PropertyDetailsComponent.vue';

export default {
    components: {
        PropertyDetailsComponent
    },
    data() {
        return {
            propertyLoading: true,
            propertyDetails: null
        }

    },
    methods: {
        getPropertyDetails() {
            this.propertyLoading = true
            axiosInstance(`/api/v1/user/listings/${this.$route.params.propertyId}`)
                .then(res => {
                    this.propertyDetails = res.data
                    console.log(res.data);
                })
                .catch(err => {

                    if (err?.response.status === 400) {
                        this.$router.replace({ name: "MyListings" })
                    }

                })
                .finally(() => {
                    this.propertyLoading = false
                })
        },
    },
    beforeMount() {
        this.getPropertyDetails()
    }
}
</script>

<style lang="scss" scoped>
.listed-property-details {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
}
</style>