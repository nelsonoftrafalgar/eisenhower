import {
	AnimateLayoutChanges,
	defaultAnimateLayoutChanges,
	useSortable
} from '@dnd-kit/sortable'
import Container, { ContainerProps } from './Container'

import { CSS } from '@dnd-kit/utilities'
import { UniqueIdentifier } from '@dnd-kit/core'

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
	defaultAnimateLayoutChanges({ ...args, wasDragging: true })

export function DroppableContainer({
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
			items={items}
			{...props}
		>
			{children}
		</Container>
	)
}
