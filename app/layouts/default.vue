<template>
	<v-app class="bg-[#F5F6F8]">
		<NavBar />
		<v-main class="mt-3.5">
			<slot />
		</v-main>
		<Footer />
	</v-app>
</template>
<script>
import NavBar from '../components/NavBar/NavBar.vue'
import Footer from '../components/Footer/footer.vue'

export default {
	name: 'DefaultLayout',
}
</script>
