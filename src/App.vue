<template>
	<div v-if="!loading" class="app-wrapper">
		<NavBar />
		<router-view />
	</div>
</template>

<script>
import axiosInstance from './axiosInterceptor';
import NavBar from './components/NavBar.vue';
import { ElLoading } from 'element-plus'

export default {
	name: 'App',
	components: {
		NavBar
	},
	data() {
		return {
			loading: true,
		}
	},
	beforeMount() {
		const loader = ElLoading.service({
			lock: true,
			background: 'rgba(0, 0, 0, 0.85)',
		})

		const cancelLoading = () => {
			loader.close()
			this.loading = false
		}

		const token = localStorage.getItem("token")

		if (!token) {
			cancelLoading()
			return;
		}

		axiosInstance.get("/api/v1/auth/verify")
			.then(res => {
				const { userName, profilePic, userRole } = res.data
				this.$store.commit("updateUser", { userName, profilePic, userRole })
			})
			.catch(err => {
				// console.log(err);
			})
			.finally(() => {
				cancelLoading()
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