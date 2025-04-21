'use client'

import {
	AnimateLayoutChanges,
	SortableContext,
	arrayMove,
	defaultAnimateLayoutChanges,
	horizontalListSortingStrategy,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
	CollisionDetection,
	DndContext,
	DragOverlay,
	DropAnimation,
	KeyboardSensor,
	MeasuringStrategy,
	MouseSensor,
	TouchSensor,
	UniqueIdentifier,
	closestCenter,
	defaultDropAnimationSideEffects,
	getFirstCollision,
	pointerWithin,
	rectIntersection,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import Container, { ContainerProps } from './components/Container'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal, unstable_batchedUpdates } from 'react-dom'

import { Add } from '@/components/Add'
import { CSS } from '@dnd-kit/utilities'
import { Item } from './components/Item'
import { coordinateGetter as multipleContainersCoordinateGetter } from './coordinatesGetter'

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
	defaultAnimateLayoutChanges({ ...args, wasDragging: true })

function DroppableContainer({
	children,
	columns = 1,
	disabled,
	id,
	items,
	style,
	...props
}: ContainerProps & {
	disabled?: boolean
	id: UniqueIdentifier
	items: UniqueIdentifier[]
	style?: React.CSSProperties
}) {
	const { isDragging, setNodeRef, transition, transform } = useSortable({
		id,
		data: {
			type: 'container',
			children: items
		},
		animateLayoutChanges
	})

	return (
		<Container
			ref={disabled ? undefined : setNodeRef}
			style={{
				...style,
				transition,
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : undefined
			}}
			columns={columns}
			id={id}
			{...props}
		>
			{children}
		</Container>
	)
}

const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: '0.5'
			}
		}
	})
}

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>

export const TRASH_ID = 'void'
const PLACEHOLDER_ID = 'placeholder'

export function MultipleContainers() {
	const [items, setItems] = useState<Items>(() => ({
		do: ['go to work', 'dupa', 'hui'],
		schedule: ['meet friends'],
		delegate: ['call grandma'],
		delete: ['walk the dog']
	}))
	const [containers, setContainers] = useState(
		Object.keys(items) as UniqueIdentifier[]
	)
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
	const lastOverId = useRef<UniqueIdentifier | null>(null)
	const recentlyMovedToNewContainer = useRef(false)
	const isSortingContainer =
		activeId != null ? containers.includes(activeId) : false

	/**
	 * Custom collision detection strategy optimized for multiple containers
	 *
	 * - First, find any droppable containers intersecting with the pointer.
	 * - If there are none, find intersecting containers with the active draggable.
	 * - If there are no intersecting containers, return the last matched intersection
	 *
	 */
	const collisionDetectionStrategy: CollisionDetection = useCallback(
		(args) => {
			if (activeId && activeId in items) {
				return closestCenter({
					...args,
					droppableContainers: args.droppableContainers.filter(
						(container) => container.id in items
					)
				})
			}

			// Start by finding any intersecting droppable
			const pointerIntersections = pointerWithin(args)
			const intersections =
				pointerIntersections.length > 0
					? // If there are droppables intersecting with the pointer, return those
					  pointerIntersections
					: rectIntersection(args)
			let overId = getFirstCollision(intersections, 'id')

			if (overId != null) {
				if (overId === TRASH_ID) {
					// If the intersecting droppable is the trash, return early
					// Remove this if you're not using trashable functionality in your app
					return intersections
				}

				if (overId in items) {
					const containerItems = items[overId]

					// If a container is matched and it contains items (columns 'A', 'B', 'C')
					if (containerItems.length > 0) {
						// Return the closest droppable within that container
						overId = closestCenter({
							...args,
							droppableContainers: args.droppableContainers.filter(
								(container) =>
									container.id !== overId && containerItems.includes(container.id)
							)
						})[0]?.id
					}
				}

				lastOverId.current = overId

				return [{ id: overId }]
			}

			// When a draggable item moves to a new container, the layout may shift
			// and the `overId` may become `null`. We manually set the cached `lastOverId`
			// to the id of the draggable item that was moved to the new container, otherwise
			// the previous `overId` will be returned which can cause items to incorrectly shift positions
			if (recentlyMovedToNewContainer.current) {
				lastOverId.current = activeId
			}

			// If no droppable is matched, return the last match
			return lastOverId.current ? [{ id: lastOverId.current }] : []
		},
		[activeId, items]
	)
	const [clonedItems, setClonedItems] = useState<Items | null>(null)
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: multipleContainersCoordinateGetter
		})
	)
	const findContainer = (id: UniqueIdentifier) => {
		if (id in items) {
			return id
		}

		return Object.keys(items).find((key) => items[key].includes(id))
	}

	const onDragCancel = () => {
		if (clonedItems) {
			// Reset items to their original state in case items have been
			// Dragged across containers
			setItems(clonedItems)
		}

		setActiveId(null)
		setClonedItems(null)
	}

	useEffect(() => {
		requestAnimationFrame(() => {
			recentlyMovedToNewContainer.current = false
		})
	}, [items])

	const handleAddItem = (category: UniqueIdentifier) => (item: string) => {
		setItems((prev) => {
			return {
				...prev,
				[category]: [...prev[category], item]
			}
		})
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetectionStrategy}
			measuring={{
				droppable: {
					strategy: MeasuringStrategy.Always
				}
			}}
			onDragStart={({ active }) => {
				setActiveId(active.id)
				setClonedItems(items)
			}}
			onDragOver={({ active, over }) => {
				const overId = over?.id

				if (overId == null || overId === TRASH_ID || active.id in items) {
					return
				}

				const overContainer = findContainer(overId)
				const activeContainer = findContainer(active.id)

				if (!overContainer || !activeContainer) {
					return
				}

				if (activeContainer !== overContainer) {
					setItems((items) => {
						const activeItems = items[activeContainer]
						const overItems = items[overContainer]
						const overIndex = overItems.indexOf(overId)
						const activeIndex = activeItems.indexOf(active.id)

						let newIndex: number

						if (overId in items) {
							newIndex = overItems.length + 1
						} else {
							const isBelowOverItem =
								over &&
								active.rect.current.translated &&
								active.rect.current.translated.top > over.rect.top + over.rect.height

							const modifier = isBelowOverItem ? 1 : 0

							newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
						}

						recentlyMovedToNewContainer.current = true

						return {
							...items,
							[activeContainer]: items[activeContainer].filter(
								(item) => item !== active.id
							),
							[overContainer]: [
								...items[overContainer].slice(0, newIndex),
								items[activeContainer][activeIndex],
								...items[overContainer].slice(newIndex, items[overContainer].length)
							]
						}
					})
				}
			}}
			onDragEnd={({ active, over }) => {
				if (active.id in items && over?.id) {
					setContainers((containers) => {
						const activeIndex = containers.indexOf(active.id)
						const overIndex = containers.indexOf(over.id)

						return arrayMove(containers, activeIndex, overIndex)
					})
				}

				const activeContainer = findContainer(active.id)

				if (!activeContainer) {
					setActiveId(null)
					return
				}

				const overId = over?.id

				if (overId == null) {
					setActiveId(null)
					return
				}

				if (overId === TRASH_ID) {
					setItems((items) => ({
						...items,
						[activeContainer]: items[activeContainer].filter((id) => id !== activeId)
					}))
					setActiveId(null)
					return
				}

				if (overId === PLACEHOLDER_ID) {
					const newContainerId = getNextContainerId()

					unstable_batchedUpdates(() => {
						setContainers((containers) => [...containers, newContainerId])
						setItems((items) => ({
							...items,
							[activeContainer]: items[activeContainer].filter(
								(id) => id !== activeId
							),
							[newContainerId]: [active.id]
						}))
						setActiveId(null)
					})
					return
				}

				const overContainer = findContainer(overId)

				if (overContainer) {
					const activeIndex = items[activeContainer].indexOf(active.id)
					const overIndex = items[overContainer].indexOf(overId)

					if (activeIndex !== overIndex) {
						setItems((items) => ({
							...items,
							[overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
						}))
					}
				}

				setActiveId(null)
			}}
			onDragCancel={onDragCancel}
		>
			<div
				style={{
					backgroundColor: '#262626',
					display: 'grid',
					boxSizing: 'border-box',
					padding: 20,
					gap: '20px',
					gridTemplateColumns: '1fr 1fr',
					gridTemplateRows: '1fr 1fr',
					height: '100%'
				}}
			>
				<SortableContext
					items={[...containers, PLACEHOLDER_ID]}
					strategy={horizontalListSortingStrategy}
				>
					{containers.map((containerId) => (
						<DroppableContainer
							key={containerId}
							id={containerId}
							items={items[containerId]}
						>
							<SortableContext
								items={items[containerId]}
								strategy={verticalListSortingStrategy}
							>
								{items[containerId].map((value, index) => {
									return (
										<SortableItem
											disabled={isSortingContainer}
											key={value}
											id={value}
											index={index}
											handle={false}
										/>
									)
								})}
								<Add handleAddItem={handleAddItem(containerId)} />
							</SortableContext>
						</DroppableContainer>
					))}
				</SortableContext>
			</div>
			{createPortal(
				<DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
					{activeId && <Item value={activeId} dragOverlay />}
				</DragOverlay>,
				document.body
			)}
		</DndContext>
	)

	function getNextContainerId() {
		const containerIds = Object.keys(items)
		const lastContainerId = containerIds[containerIds.length - 1]

		return String.fromCharCode(lastContainerId.charCodeAt(0) + 1)
	}
}

interface SortableItemProps {
	id: UniqueIdentifier
	index: number
	handle: boolean
	disabled?: boolean
}

function SortableItem({ disabled, id, index }: SortableItemProps) {
	const { setNodeRef, listeners, transform, transition } = useSortable({
		id
	})

	return (
		<Item
			ref={disabled ? undefined : setNodeRef}
			value={id}
			index={index}
			transition={transition}
			transform={transform}
			listeners={listeners}
		/>
	)
}
