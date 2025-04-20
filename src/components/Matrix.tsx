'use client'

import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	closestCenter,
	closestCorners,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
	rectSwappingStrategy,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'

import { Add } from './Add'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'
import { useState } from 'react'

interface Matrix {
	do: string[]
	schedule: string[]
	delegate: string[]
	delete: string[]
}

const initialMatrix = {
	do: ['go to work', 'dupa', 'hui'],
	schedule: ['meet friends'],
	delegate: ['call grandma'],
	delete: ['walk the dog']
}

export const Matrix = () => {
	const [matrix, setMatrix] = useState<Matrix>(initialMatrix)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5
			}
		})
	)

	const handleAddItem = (category: keyof Matrix) => (item: string) => {
		setMatrix((prev) => {
			return {
				...prev,
				[category]: [...prev[category], item]
			}
		})
	}

	// const handleDragEnd = (event: DragEndEvent) => {
	// 	const { active, over } = event

	// 	if (!over || active.id === over.id) return

	// 	let sourceList: string = ''
	// 	const draggedItem: string = active.id as string

	// 	// Find source list
	// 	for (const key in matrix) {
	// 		if (matrix[key as keyof typeof matrix].includes(draggedItem)) {
	// 			sourceList = key
	// 			break
	// 		}
	// 	}

	// 	if (!sourceList || !over.id || sourceList === over.id) return

	// 	setMatrix((prev) => {
	// 		const newSource = prev[sourceList as keyof typeof prev].filter(
	// 			(item) => item !== draggedItem
	// 		)
	// 		const newTarget = [...prev[over.id as keyof typeof prev], draggedItem]

	// 		return {
	// 			...prev,
	// 			[sourceList]: newSource,
	// 			[over.id]: newTarget
	// 		}
	// 	})
	// }

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		console.log('{ active, over }: ', { active, over })
		if (!over || active.id === over.id) return

		let sourceList = ''
		let targetList = ''

		for (const key in matrix) {
			if (matrix[key as keyof Matrix].includes(active.id as string)) {
				sourceList = key
			}
			if (matrix[key as keyof Matrix].includes(over.id as string)) {
				targetList = key
			}
		}

		if (!sourceList) return

		// Moving between lists
		if (sourceList !== targetList) {
			setMatrix((prev) => {
				const sourceItems = prev[sourceList as keyof Matrix].filter(
					(item) => item !== active.id
				)
				const targetItems = [
					...(prev[targetList as keyof Matrix] ?? []),
					active.id as string
				]

				return {
					...prev,
					[sourceList]: sourceItems,
					[targetList]: targetItems
				}
			})
		} else {
			// Sorting within the same list
			const items = matrix[sourceList as keyof Matrix]
			const oldIndex = items.indexOf(active.id as string)
			const newIndex = items.indexOf(over.id as string)

			if (oldIndex !== newIndex) {
				setMatrix((prev) => ({
					...prev,
					[sourceList]: arrayMove(items, oldIndex, newIndex)
				}))
			}
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
		>
			<div className='container'>
				{Object.keys(matrix).map((category) => (
					<Droppable className={category} key={category} id={category}>
						<h2>{category.toUpperCase()}</h2>
						<SortableContext
							items={matrix[category as keyof Matrix]}
							strategy={verticalListSortingStrategy}
						>
							<div className='list'>
								{matrix[category as keyof Matrix].map((item) => (
									<Draggable key={item} id={item}>
										<span className='item'>{item}</span>
									</Draggable>
								))}
							</div>
							<Add handleAddItem={handleAddItem(category as keyof Matrix)} />
						</SortableContext>
					</Droppable>
				))}
			</div>
		</DndContext>
	)
}

/*
TODO
sortable list
overflow scroll
*/
