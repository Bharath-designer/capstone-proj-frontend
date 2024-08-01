<template>
    <div v-if="analyticsLoading" v-loading="true" class="analytics-wrapper">
    </div>
    <div v-else-if="analytics" class="analytics-wrapper">
        <div class="total-container">
            <div class="total-card">
                <div class="label">
                    Total Views
                </div>
                <div class="value">
                    {{ analytics.totalViews }}
                </div>
            </div>
        </div>
        <div class="graph-container">

        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInterceptor';

export default {
    data() {
        return {
            analytics: null,
            analyticsLoading: true,
        }
    },
    methods: {
        getDetails() {
            this.analyticsLoading = true
            axiosInstance(`/api/v1/user/analytics/${this.$route.params.propertyId}`)
                .then(res => {
                    this.analytics = res.data
                    console.log(this.analytics);
                })
                .catch(err => {
                    if (err?.response.status === 400) {
                        this.$router.replace({ name: "MyListings" })
                    }
                })
                .finally(err => {
                    this.analyticsLoading = false
                })
        }
    },
    beforeMount() {
        this.getDetails()
    }
}

</script>

<style scoped lang="scss">

.analytics-wrapper {
    flex: 1;
    overflow: auto;
    padding: 1em;

    .total-container {
        display: flex;

        .total-card {
            border: 1px solid rgb(156, 156, 156);
            padding: 1em 2em;
            border-radius: .25em;

            .label {
                font-size: .8em;
                color: rgb(84, 84, 84);
            }

            .value {
                margin-top: .5em;
                font-size: 1.2em;
                text-align: center
            }
        }
    }


}

</style>