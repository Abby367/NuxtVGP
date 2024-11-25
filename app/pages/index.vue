<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-vuetify" />
			Nuxt 3 / Vuetify / GraphQL / Pinia
		</h2>
		<div class="flex justify-between">
			<!-- Filter by Year -->
			<div class="relative my-4">
				<button
					@click="showYearDropdown = !showYearDropdown"
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
				>
					{{ selectedYear || 'Filter by Year' }}
					<span class="float-right">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 inline"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
				</button>

				<!-- Dropdown Options -->
				<div
					v-if="showYearDropdown"
					class="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto w-full"
				>
					<ul>
						<li
							v-for="year in availableYears"
							@click="selectYear(year)"
							class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
						>
							{{ year }}
						</li>
						<li
							@click="selectYear(null)"
							class="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
						>
							Clear Selection
						</li>
					</ul>
				</div>
			</div>
			<div class="relative my-4">
				<button
					@click="showFavoriteDropdown = !showFavoriteDropdown"
					:disabled="isFavoritesDisabled"
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"
				>
					Favorites ({{ favoriteCount }})
				</button>
				<ul
					v-if="showFavoriteDropdown"
					class="absolute bg-white border mt-1 rounded-lg shadow-lg z-10"
				>
					<li
						@click="showFavorites"
						:disabled="isFavoritesDisabled"
						class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
					>
						Show Favorites
					</li>

					<li
						@click="clearFavoritesFilter"
						class="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
					>
						Clear Favorites
					</li>
				</ul>
			</div>
			<!-- Sort by Launch Date using an Icon -->
			<!-- Sort Filter Icon -->
			<div class="flex justify-end my-4 items-center gap-2.5">
				<h3 class="font-bold">Sort:</h3>
				<button
					@click="toggleSortOrder"
					class="bg-white border border-gray-300 text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					:title="sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<!-- Dynamic Sort Direction -->
						<path
							v-if="sortOrder === 'asc'"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 4h18M8 8l4 4m0 0l4-4m-4 4V4"
						/>
						<path
							v-else
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 20h18M8 16l4-4m0 0l4 4m-4-4v8"
						/>
					</svg>
				</button>
			</div>
		</div>
		<!-- Launch Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div
				v-for="launch in paginatedLaunches"
				:key="launch.id"
				class="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 relative"
			>
				<!-- Mission Image -->
				<img
					src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
					alt="Mission Image"
					class="w-full h-64 object-cover"
				/>

				<!-- Card Content -->
				<div class="flex justify-between">
					<div class="p-4">
						<!-- Mission Name -->
						<h3 class="text-xl font-bold text-gray-800">
							{{ launch.mission_name || 'No mission data available' }}
						</h3>

						<!-- Launch Date -->
						<p class="text-gray-600 mt-2">
							<strong>Launch Date:</strong>
							{{ launch.launch_date_local || 'No launch date available' }}
						</p>

						<!-- Launch Site -->
						<p class="text-gray-600 mt-2">
							<strong>Launch Site:</strong>
							{{ launch.launch_site?.site_name || 'No launch site available' }}
						</p>

						<!-- Description -->
						<div
							class="text-gray-700 text-sm mt-4 overflow-hidden overflow-ellipsis max-h-20"
							:title="launch.details"
						>
							<strong>Description:</strong>
							{{ launch.details || 'No details available' }}
						</div>
					</div>
					<div class="mr-2.5">
						<v-btn
							icon
							@click="toggleFavorite(launch)"
							:class="{ 'text-indigo-600': isFavorite(launch) }"
							class="fixed top-2 z-10"
						>
							<v-icon>mdi-heart</v-icon>
						</v-btn>
					</div>
				</div>
				<!-- Divider -->
				<div class="border-t border-gray-200"></div>

				<!-- Rocket Details -->
				<div class="p-4">
					<p class="text-gray-800">
						<strong>Rocket Name:</strong>
						{{ launch.rocket?.rocket_name || 'No rocket data available' }}
					</p>

					<!-- View Rocket Button -->
					<button
						@click="viewRocket(launch)"
						class="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
					>
						View Rocket
					</button>

					<!-- Collapsible Rocket Details -->
					<div
						v-if="expandedRocketIds.has(launch.id)"
						class="mt-4 p-4 bg-gray-100 rounded-lg text-gray-700"
					>
						<p>
							<strong>Rocket Name:</strong>
							{{ launch.rocket?.rocket.name }}
						</p>
						<p>
							<strong>Description:</strong>
							{{ launch.rocket?.rocket.description }}
						</p>
						<p>
							<strong>First Flight:</strong>
							{{ launch.rocket?.rocket.first_flight }}
						</p>
						<p>
							<strong>Height:</strong>
							{{ launch.rocket?.rocket.height.feet }} feet
						</p>
						<p>
							<strong>Diameter:</strong>
							{{ launch.rocket?.rocket.diameter.feet }} feet
						</p>
						<p>
							<strong>Mass:</strong>
							{{ launch.rocket?.rocket.mass.kg }} kg
						</p>
						<p>
							<strong>Stages:</strong>
							{{ launch.rocket?.rocket.stages }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Pagination -->
		<v-row justify="center" class="my-4">
			<v-btn :disabled="currentPage === 1" @click="previousPage">Previous</v-btn>
			<v-btn :disabled="currentPage === totalPages" @click="nextPage">Next</v-btn>
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useFavoritesStore } from '../stores/useFavoritesStore'

// GraphQL Query to fetch launches
const query = gql`
	query Query {
		launches {
			id
			mission_name
			launch_date_local
			details
			launch_site {
				site_name
			}
			rocket {
				rocket_name
				rocket {
					name
					description
					first_flight
					height {
						feet
					}
					diameter {
						feet
					}
					mass {
						kg
					}
					stages
				}
			}
		}
	}
`

// Use the favorites store
const favoritesStore = useFavoritesStore()
const showFavoriteDropdown = ref(false)

// Favorite Launches from the store
const favoriteLaunches = computed(() => favoritesStore.favoriteLaunches)
const favoriteIds = computed(() => new Set(favoriteLaunches.value.map((launch) => launch.id)))

// Count of favorite launches
const favoriteCount = computed(() => favoriteLaunches.value.length)

// Add or remove a launch from favorites
const toggleFavorite = (launch) => {
	if (isFavorite(launch)) {
		favoritesStore.favoriteLaunches = favoritesStore.favoriteLaunches.filter(
			(fav) => fav.id !== launch.id,
		)
	} else {
		favoritesStore.favoriteLaunches = [...favoritesStore.favoriteLaunches, launch]
	}
}

// Check if a launch is in favorites
const isFavorite = (launch) => favoriteIds.value.has(launch.id)

const isFavoritesDisabled = computed(() => favoriteCount.value === 0)
// Fetch data from GraphQL
const { result, loading, error } = useQuery(query)
const launches = computed(() => result.value?.launches ?? [])

// Pagination
const itemsPerPage = 3 // Number of cards to display per page
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(sortedLaunches.value.length / itemsPerPage))

const paginatedLaunches = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage
	return sortedLaunches.value.slice(start, start + itemsPerPage)
})

// Pagination Controls
const hasNextPage = computed(() => currentPage.value < totalPages.value)

const nextPage = () => {
	if (hasNextPage.value) {
		currentPage.value++
	}
}

const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--
	}
}

// Get available years dynamically for filtering
const availableYears = computed(() => [
	...new Set(launches.value.map((launch) => new Date(launch.launch_date_local).getFullYear())),
])

// Filter by year
const selectedYear = ref(null)

// Filtered launches considering favorite launches as well
const filteredLaunches = computed(() =>
	launches.value.filter((launch) => {
		const matchesYear =
			!selectedYear.value || new Date(launch.launch_date_local).getFullYear() === selectedYear.value
		const isFavoriteLaunch = favoriteIds.value.has(launch.id)
		return matchesYear && (showOnlyFavorites.value ? isFavoriteLaunch : true)
	}),
)

// Sorting by launch date
const sortOrder = ref('asc') // Default sorting order
const sortedLaunches = computed(() => {
	return [...filteredLaunches.value].sort((a, b) => {
		const dateA = new Date(a.launch_date_local).getTime()
		const dateB = new Date(b.launch_date_local).getTime()
		return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
	})
})

// Watch for changes in selectedYear or sortOrder to reset pagination
watch([selectedYear, sortOrder], () => {
	currentPage.value = 1 // Reset to first page when filter or sort changes
})

// For collapsible section
const expandedRocketIds = ref(new Set()) // Track expanded rocket details for multiple launches

const viewRocket = (launch) => {
	if (expandedRocketIds.value.has(launch.id)) {
		expandedRocketIds.value.delete(launch.id) // Close the details if it's already open
	} else {
		expandedRocketIds.value.add(launch.id) // Open the details for this launch
	}
}

const showYearDropdown = ref(false) // Controls visibility of the dropdown

// Function to handle year selection
const selectYear = (year) => {
	selectedYear.value = year // Update selected year
	showYearDropdown.value = false // Close the dropdown
}

const toggleSortOrder = () => {
	sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Show only favorites
const showOnlyFavorites = ref(false)

const showFavorites = () => {
	showOnlyFavorites.value = true // Filter to show only favorites
}

// Clear favorites list
const clearFavoritesFilter = () => {
	window.location.reload()
}
</script>

<style scoped>
/* You can adjust the CSS styles here if needed */
.text-purple-6 {
	color: #9c27b0; /* Adjust the purple shade */
}

.cursor-pointer {
	cursor: pointer;
}

/* Style the heart icon */
.v-btn .v-icon {
	font-size: 24px;
}

/* Style for the active heart icon (indigo when favorited) */
.text-indigo-600 {
	color: #5c6bc0; /* Indigo color */
}
</style>
