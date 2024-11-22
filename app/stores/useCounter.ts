// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounter = defineStore('counter', {
	state: () => ({
		count: 0, // Index of the current mission
	}),
	actions: {
		increment() {
			this.count++
		},
	},
})
