<template>
    <div class="home-wrapper">
        <div class="home-search-container">
            <div class="slogan">Buy or Sell Property from your home</div>
            <div class="home-search-content">
                <el-select filterable ref="stateref" clearable class="state select-element" v-model="stateValue"
                    placeholder="Select State" size="large">
                    <el-option v-for="item in states" :key="item" :label="item" :value="item" />
                </el-select>
                <el-select clearable ref="tagref" class="tag select-element" v-model="selectedTags" multiple filterable
                    remote reserve-keyword collapse-tags collapse-tags-tooltip :max-collapse-tags="2"
                    placeholder="Search for tags" :remote-method="getTags" :loading="tagsLoading" size="large">
                    <el-option v-for="item in tags" :key="item" :label="item" :value="item" />
                </el-select>

                <button id="search-btn" @click="goToProperties" class="search-btn">
                    <span>Search Properties</span>
                    <img :src="require('@/assets/right-blue.svg')" alt="">
                </button>
            </div>
        </div>
        <div class="why-choosing-us">
            <div class="section-title">
                Why choosing us
            </div>
            <div class="section-card-container">
                <div class="section-card">
                    <div class="card-title">
                        Verified Properties
                    </div>
                    <div class="card-desc">
                        Each property is verified before publishing to public
                    </div>
                </div>
                <div class="section-card">
                    <div class="card-title">
                        No Broker
                    </div>
                    <div class="card-desc">
                        No middleman between the buyer and the seller
                    </div>
                </div>

                <div class="section-card">
                    <div class="card-title">
                        Free Trial
                    </div>
                    <div class="card-desc">
                        Every user will have 1 free limit for posting and viewing property
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-tour size="small" v-model="tourOpen" :mask="true">
        <el-tour-step size="small" :target="$refs?.stateref?.$el" description="Select State (Optional)" />
        <el-tour-step size="small" :target="$refs?.tagref?.$el" description="Select Tags (Optional)" />
        <el-tour-step size="small" target="#search-btn" description="Explore Properties" />
    </el-tour>
    <div v-if="tourConsent" class="take-tour-consent">
        <span>Get a virutal tour</span>
        <div class="btn-container">
            <el-button @click="consentYesHandler" size="small">Yes</el-button>
            <el-button @click="consentNoHandler" size="small">No</el-button>
        </div>
    </div>
</template>

<script>

import axiosInstance from "@/axiosInterceptor";
import states from "@/utilities/StateList"

export default {
    name: "Home",
    data() {
        return {
            states,
            stateValue: "",
            tags: [],
            selectedTags: [],
            tagsLoading: true,
            tourOpen: false,
            tourConsent: false
        }
    },
    computed: {
        user() {
            // console.log(this.$store.state.user);
            return this.$store.state.user
        }
    },
    methods: {
        goToProperties() {

            let obj = {}
            if (this.stateValue) {
                obj.state = this.stateValue
            }

            if (this.selectedTags.length > 0) {
                obj.tags = this.selectedTags
            }

            this.$router.push({ name: "Property", query: obj })
        },
        getTags(query) {
            this.tagsLoading = true
            if (!query) query = "";
            axiosInstance(`/api/v1/tags?query=${query}`)
                .then(res => {
                    this.tags = res.data
                })
                .catch(err => {
                    // console.log(err);
                })
                .finally(() => {
                    this.tagsLoading = false
                })
        },
        consentYesHandler() {
            this.tourOpen = true
            this.consentNoHandler()
        },
        consentNoHandler() {
            this.tourConsent = false
            localStorage.setItem("tour", "done")
        }
    },
    mounted() {



        const consent = localStorage.getItem("tour")

        if (consent !== "done") {
            setTimeout(() => {
                this.tourConsent = true
            }, 0);
        }
    }
}
</script>

<style scoped lang="scss">
.home-wrapper {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home-search-container {
    width: min(50em, 90%);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 2em 1em;
    margin-top: 4em;
    border-radius: .25em;

    .slogan {
        font-weight: bold;
        color: #646464;
        font-size: 1.2em;
        letter-spacing: 1px;
        text-align: center
    }

    .home-search-content {
        border: 1px solid #818181;
        border-radius: .25em;
        margin-top: 2em;
        display: flex;

        .select-element.state {
            width: 9em;
        }

        .select-element.tag {
            width: 15em;
        }

        .select-element {
            border-right: 1px solid #818181;
        }

        .select-element * {
            box-shadow: none;
            color: rgb(112, 112, 112);
        }

        button {
            border: none;
            background: none
        }

        .search-btn {
            padding: 0 1em;
            display: flex;
            align-items: center;

            span {
                display: none;
            }

            img {
                cursor: pointer;
                width: 1.3em;
            }
        }

        @media screen and (max-width:650px) {
            width: 100%;
            flex-direction: column;

            .select-element.state {
                width: 100%;
            }

            .select-element.tag {
                width: 100%;
            }

            .select-element {
                border: none;
                border-bottom: 1px solid #818181;
            }

            .search-btn {
                padding: 1em;
                width: 100%;
                justify-content: center;
                align-items: center;
                gap: 1em;
                font-family: inter;
                color: var(--primary-color);
                font-weight: 500;
                cursor: pointer;

                span {
                    display: block;
                }
            }
        }

    }

}

.why-choosing-us {
    width: min(50em, 90%);
    margin-top: 3em;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .section-title {
        text-align: center;
        font-weight: 500;
        color: #323232;
        font-size: 1.1em;
    }

    .section-card-container {
        display: flex;
        flex-wrap: wrap;
        gap: .8em;
        justify-content: center;

        .section-card {
            padding: .5em;
            background: white;
            max-width: 15em;
            border-radius: .25em;
            display: flex;
            flex-direction: column;

            .card-title {
                text-align: center;
                color: var(--primary-color);
                font-weight: 500;
                padding: .4em;
            }

            .card-desc {
                font-size: .9em;
                padding: .5em;
                text-align: center;
            }
        }
    }
}

.take-tour-consent {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: .9em;
    padding: 1em 2em;
    background: white;
    border-radius: .25em;
    transform: translate(20px, -20px);
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: .5em;
    z-index: 2;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.673);

    span {
        font-size: .9em;
    }

    .btn-container {
        display: flex;
    }
}
</style>