import { Items } from '@/components/Matrix'

export const saveMatrixToStorage = (items: Items) => {
	localStorage.setItem('eisenhower-matrix', JSON.stringify(items))
}

export const getMatrixFromStorage = (): Items | null => {
	const matrix = localStorage.getItem('eisenhower-matrix')
	return matrix ? JSON.parse(matrix) : null
}
