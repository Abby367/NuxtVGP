import { defineStore } from 'pinia'

// Define the type for a Launch
interface Launch {
	id: string
	mission_name: string
	launch_date_local: string
	details?: string
	launch_site?: {
		site_name: string
	}
	rocket?: {
		rocket_name: string
		rocket?: {
			name: string
			description: string
			first_flight: string
			height: { feet: number }
			diameter: { feet: number }
			mass: { kg: number }
			stages: number
		}
	}
}

export const useFavoritesStore = defineStore('favorites', {
	state: () => ({
		favoriteLaunches: [] as Launch[], // Explicitly define the type of favoriteLaunches
	}),
	actions: {
		// Add a launch to favorites
		addFavorite(launch: Launch) {
			if (!this.favoriteLaunches.some((fav) => fav.id === launch.id)) {
				this.favoriteLaunches.push(launch)
				console.log('Added launch to favorites:', launch) // Debug: Log added launch
			}
		},

		// Remove a launch from favorites
		removeFavorite(launch: Launch) {
			this.favoriteLaunches = this.favoriteLaunches.filter((fav) => fav.id !== launch.id)
			console.log('Removed launch from favorites:', launch) // Debug: Log removed launch
		},
	},
})
