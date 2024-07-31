<template>
    <div class="home-wrapper">
        <div class="home-search-container">
            <div class="slogan">Buy or Sell Property from your home</div>
            <div class="home-search-content">
                <el-select class="state select-element" v-model="stateValue" placeholder="Select State" size="large">
                    <el-option v-for="item in states" :key="item" :label="item" :value="item" />
                </el-select>
                <el-select class="tag select-element" v-model="selectedTags" multiple filterable remote reserve-keyword
                    collapse-tags collapse-tags-tooltip :max-collapse-tags="2" placeholder="Search for tags"
                    :remote-method="getTags" :loading="tagsLoading" size="large">
                    <el-option v-for="item in tags" :key="item" :label="item" :value="item" />
                </el-select>

                <button class="search-btn">
                    <img :src="require('@/assets/right-blue.svg')" alt="">
                </button>
            </div>
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
            tagsLoading: true
        }
    },
    computed: {
        user() {
            console.log(this.$store.state.user);
            return this.$store.state.user
        }
    },
    methods: {
        getTags(query) {
            this.tagsLoading = true
            axiosInstance(`/api/v1/tags?query=${query}`)
                .then(res => {
                    this.tags = res.data
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.tagsLoading = false
                })
        },
    },
    beforeMount() {
        this.getTags()
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

            img {
                cursor: pointer;
                width: 1.3em;
            }
        }
    }

}
</style>