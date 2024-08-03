<template>
    <div class="listed-properties-wrapper">
        <div class="listed-property-nav">
            <router-link :to="{ name: 'ListedPropertyDetails' }" class="sub-nav">Property Details</router-link>
            <router-link :to="{ name: 'PropertyViewedUsers' }" class="sub-nav">Requeted Users</router-link>
            <router-link :to="{ name: 'Analytics' }" class="sub-nav">Analytics</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
.listed-properties-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;


    .listed-property-nav {
        display: flex;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        position: relative;
        z-index: 998;
        padding: 0 1em;
        overflow: auto;

        .sub-nav {
            text-decoration: none;
            font-size: .9em;
            padding: 1em .5em;
            color: rgb(57, 57, 57);
            cursor: pointer;
            background: white;
            white-space: nowrap;
        }

    .sub-nav.router-link-exact-active {
            color: red;
            font-weight: 500;
        }

    }
}
</style>