'use client'

import { Items } from '@/components/Matrix'

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
