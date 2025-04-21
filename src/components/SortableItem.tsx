import { Item } from './Item'
import { ReactNode } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'

interface SortableItemProps {
	id: UniqueIdentifier
	index: number
	disabled?: boolean
	handleDeleteItem: (item: ReactNode) => void
	handleEditItem: (item: UniqueIdentifier) => void
}

export function SortableItem({
	disabled,
	id,
	index,
	handleDeleteItem,
	handleEditItem
}: SortableItemProps) {
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
			handleDeleteItem={handleDeleteItem}
			handleEditItem={handleEditItem}
		/>
	)
}
