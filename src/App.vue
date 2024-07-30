<template>
	<div v-if="loading" class="app-loader">
		<v-progress-circular color="dark-blue" indeterminate :size="50"></v-progress-circular>
	</div>
	<div v-else class="app-wrapper">
		<NavBar />
		<router-view />
	</div>
</template>

<script>
import axiosInstance from './axiosInterceptor';
import NavBar from './components/NavBar.vue';

export default {
	name: 'App',
	components: {
		NavBar
	},
	data() {
		return {
			loading: true
		}
	},
	beforeMount() {

		const token = localStorage.getItem("token")

		if (!token) {
			this.loading = false
			return;
		}

		axiosInstance.get("/api/v1/auth/verify")
			.then(res => {
				const { userName, profilePic, userRole } = res.data
				this.$store.commit("updateUser", { userName, profilePic, userRole })
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				this.loading = false
			})
	},
}


</script>


<style scoped lang="scss">
.app-wrapper {
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: 100svh;
	overflow: hidden;

}

.app-loader {
	height: 100vh;
	height: 100svh;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>