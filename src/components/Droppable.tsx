import { PropsWithChildren } from 'react'
import { useDroppable } from '@dnd-kit/core'

interface DroppableProps extends PropsWithChildren {
	className: string
	id: string
}

export const Droppable = ({ id, children, className }: DroppableProps) => {
	const { setNodeRef } = useDroppable({ id })
	return (
		<div className={className} ref={setNodeRef}>
			{children}
		</div>
	)
}
