'use client'

import { Items } from '@/components/Matrix'
import { UniqueIdentifier } from '@dnd-kit/core'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

export const saveMatrixToStorage = (items: Items) => {
	if (typeof window === 'object') {
		localStorage.setItem('eisenhower-matrix', JSON.stringify(items))
	}
}

export const getMatrixFromStorage = (): Items | undefined => {
	if (typeof window === 'object') {
		const matrix = localStorage.getItem('eisenhower-matrix')
		return matrix ? JSON.parse(matrix) : undefined
	}
}

export const saveDateToStorage = (value: string) => {
	if (typeof window === 'object') {
		const matrixDatesString = localStorage.getItem('matrix-dates')

		if (matrixDatesString) {
			const matrixDates = JSON.parse(matrixDatesString)

			const newDates = [
				...matrixDates,
				{ id: uuidv4(), [value]: format(new Date(), 'd MMMM yyyy') }
			]

			localStorage.setItem('matrix-dates', JSON.stringify(newDates))
		} else {
			localStorage.setItem(
				'matrix-dates',
				JSON.stringify([
					{ id: uuidv4(), [value]: format(new Date(), 'd MMMM yyyy') }
				])
			)
		}
	}
}

export const updateDateInStorage = (oldValue: string, newValue: string) => {
	if (typeof window === 'object') {
		const matrixDates = JSON.parse(localStorage.getItem('matrix-dates')!)
		const dateIndex = matrixDates.findIndex(
			(item: Record<string, string>) => oldValue in item
		)
		const dateAdded = matrixDates[dateIndex][oldValue]

		localStorage.setItem(
			'matrix-dates',
			JSON.stringify(
				matrixDates.map((date: Record<string, string>) => {
					if (date.id === matrixDates[dateIndex].id) {
						return { id: matrixDates[dateIndex].id, [newValue]: dateAdded }
					}

					return date
				})
			)
		)
	}
}

export const removeDateFromStorage = (oldValue: string) => {
	if (typeof window === 'object') {
		const matrixDates = JSON.parse(localStorage.getItem('matrix-dates')!)
		const dateIndex = matrixDates.findIndex(
			(item: Record<string, string>) => oldValue in item
		)

		localStorage.setItem(
			'matrix-dates',
			JSON.stringify(
				matrixDates.filter(
					(date: Record<string, string>) => date.id !== matrixDates[dateIndex].id
				)
			)
		)
	}
}

export const getDateFromStorage = (value: string) => {
	if (typeof window === 'object') {
		const matrixDates = JSON.parse(localStorage.getItem('matrix-dates')!)
		const dateIndex = matrixDates.findIndex(
			(item: Record<string, string>) => value in item
		)
		return matrixDates[dateIndex][value]
	}
}

export const clearDatesInStorage = (items: UniqueIdentifier[]) => {
	if (typeof window === 'object') {
		const matrixDates = JSON.parse(localStorage.getItem('matrix-dates') || '[]')

		const filteredDates = matrixDates.filter(
			(date: Record<string, string>) => !items.some((item) => item in date)
		)

		localStorage.setItem('matrix-dates', JSON.stringify(filteredDates))
	}
}
