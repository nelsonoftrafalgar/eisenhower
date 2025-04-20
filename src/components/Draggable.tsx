// import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import DragHandle from '../assets/drag-handle.svg'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'

interface DraggableProps {
	id: string
	children: React.ReactNode
}

export const Draggable = ({ id, children }: DraggableProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })
	console.log('transform: ', transform)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<div
			ref={setNodeRef}
			className='draggable'
			style={style}
			{...listeners}
			{...attributes}
		>
			<div className='drag-icon'>
				<Image fill src={DragHandle} alt='' />
			</div>
			{children}
		</div>
	)
}
