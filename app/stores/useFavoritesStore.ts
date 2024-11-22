import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
	state: () => ({
		favoriteLaunches: [], // Store the favorite launches
	}),
	actions: {
		// Add a launch to favorites
		addFavorite(launch) {
			if (!this.favoriteLaunches.some((fav) => fav.id === launch.id)) {
				this.favoriteLaunches.push(launch)
				console.log('Added launch to favorites:', launch) // Debug: Log added launch
			}
		},

		// Remove a launch from favorites
		removeFavorite(launch) {
			this.favoriteLaunches = this.favoriteLaunches.filter((fav) => fav.id !== launch.id)
			console.log('Removed launch from favorites:', launch) // Debug: Log removed launch
		},
	},
})
