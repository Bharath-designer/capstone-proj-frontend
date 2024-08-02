<template>
    <Map :center="center" :zoom="7" map-type-id="hybrid" style="width: 100%; height: 20em" @click="onMapClick">
        <Marker :position="center" :draggable="editable" @dragend="onDragEnd" />
    </Map>
</template>

<script>
import { Map, Marker } from '@fawmi/vue-google-maps';

export default {
    name: 'App',
    components: {
        Map,
        Marker,
    },
    props: [
        "editable",
        "latitude",
        "longitude",
    ],
    data() {
        return {
            center: { lat: this.latitude, lng: this.longitude },
            coordinates: { lat: this.latitude, lng: this.longitude },
        };
    },
    watch: {
        coordinates() {
            this.$emit("update", this.coordinates)
        },
        latitude() {
            this.center = {
                lat: this.latitude,
                lng: this.longitude,
            };
            this.coordinates = this.center;
        }
    },
    methods: {
        onMapClick(event) {
            if (!this.editable) return;
            const latLng = event.latLng;
            this.coordinates = {
                lat: latLng.lat(),
                lng: latLng.lng(),
            };
            this.center = this.coordinates
        },
        onDragEnd(event) {
            const newLatLng = event.latLng;
            this.coordinates = {
                lat: newLatLng.lat(),
                lng: newLatLng.lng(),
            };
        },
    },
    mounted() {

    },
};
</script>