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
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script>

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
import axiosInstance from '@/axiosInterceptor';
import { parseDateString } from '@/utilities/ParseDate';

export default {
    components: { Line },
    data() {
        return {
            analytics: null,
            analyticsLoading: true,
            chartData: {
                labels: [], // X-axis labels
                datasets: [
                    {
                        label: '',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        data: [], // Y-axis data
                        fill: false,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
                        pointBorderColor: '#fff', // Point border color
                        pointBorderWidth: 2, // Point border width
                        pointRadius: 5 // Point radius
                    }
                ]
            },
            // Chart options
            chartOptions: {
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `Visits: ${tooltipItem.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'No. of property requests'
                        },
                        beginAtZero: true
                    }
                }
            }
        }
    },
    methods: {
        getDetails() {
            this.analyticsLoading = true
            axiosInstance(`/api/v1/user/analytics/${this.$route.params.propertyId}`)
                .then(res => {
                    this.analytics = res.data
                    const label = []
                    const visitData = []
                    res.data.last7DaysAnalytics.forEach(data => {
                        const { date, visits } = data
                        const parsedDate = parseDateString(date)
                        label.push(parsedDate)
                        visitData.push(visits)
                    })


                    this.chartData.labels = label
                    this.chartData.datasets[0].data = visitData
                })
                .catch(err => {
                    if (err?.response.status === 400) {
                        this.$router.replace({ name: "My Listings" })
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
    display: flex;
    flex-direction: column;
    gap: 1em;

    .total-container {
        display: flex;
        justify-content: center;

        .total-card {
            border: 1px solid rgb(156, 156, 156);
            padding: .5em 2em;
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

    .graph-container {
        flex: 1;
        overflow: hidden;
        width: 100%;
        display: flex;
        justify-content: center;

        canvas {
            max-width: 100%;
        }
    }


}
</style>