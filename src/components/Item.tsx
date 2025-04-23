import type {
	DraggableSyntheticListeners,
	UniqueIdentifier
} from '@dnd-kit/core'
import React, {
	ChangeEventHandler,
	KeyboardEventHandler,
	ReactNode,
	forwardRef,
	useEffect,
	useRef,
	useState
} from 'react'
import {
	getDateFromStorage,
	removeDateFromStorage,
	updateDateInStorage
} from '@/utils/storage'

import { Delete } from '../icons/Delete'
import { DragHandle } from '../icons/DragHandle'
import type { Transform } from '@dnd-kit/utilities'

export interface Props {
	dragOverlay?: boolean
	index?: number
	transform?: Transform | null
	listeners?: DraggableSyntheticListeners
	style?: React.CSSProperties
	transition?: string | null
	value: React.ReactNode
	handleDeleteItem?: (item: ReactNode) => void
	handleEditItem?: (item: UniqueIdentifier) => void
}

export const Item = React.memo(
	forwardRef<HTMLLIElement, Props>(
		(
			{
				dragOverlay,
				index,
				listeners,
				style,
				transition,
				transform,
				value,
				handleDeleteItem,
				handleEditItem,
				...props
			},
			ref
		) => {
			const inputRef = useRef<HTMLInputElement>(null)
			const [isEditMode, setIsEditMode] = useState(false)
			const [inputValue, setInputValue] = useState(value?.toString())

			const dateAdded = getDateFromStorage(value as string)

			useEffect(() => {
				if (!dragOverlay) {
					return
				}

				document.body.style.cursor = 'grabbing'

				return () => {
					document.body.style.cursor = ''
				}
			}, [dragOverlay])

			useEffect(() => {
				if (isEditMode && inputRef.current) {
					inputRef.current.focus()
				}
			}, [isEditMode])

			const openEditMode = () => setIsEditMode(true)

			const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
				setInputValue(e.target.value)
			}

			const handleItemSave = () => {
				handleEditItem?.(inputValue as UniqueIdentifier)
				setIsEditMode(false)
				updateDateInStorage(value as string, inputValue!)
			}

			const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
				if (e.key === 'Enter') {
					handleItemSave()
				}

				if (e.key === 'Escape') {
					setInputValue(value?.toString())
					setIsEditMode(false)
				}
			}

			const deleteItem = () => {
				handleDeleteItem?.(value)
				removeDateFromStorage(value as string)
			}

			return (
				<li
					className='wrapper'
					style={
						{
							transition: [transition].filter(Boolean).join(', '),
							'--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
							'--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
							'--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
							'--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
							'--index': index
						} as React.CSSProperties
					}
					ref={ref}
				>
					<div {...listeners} tabIndex={0} className='drag-icon'>
						<DragHandle />
					</div>
					<div className='item' style={style} {...props}>
						{isEditMode ? (
							<input
								ref={inputRef}
								className='edit-input'
								type='text'
								value={inputValue}
								onBlur={handleItemSave}
								onChange={handleValueChange}
								onKeyDown={handleKeyDown}
							/>
						) : (
							<span
								tabIndex={0}
								onKeyDown={openEditMode}
								onClick={openEditMode}
								className='value'
								data-date={dateAdded}
							>
								{value}
							</span>
						)}
						<div className='menu'>
							<button onClick={deleteItem} className='menu-icon'>
								<Delete />
							</button>
						</div>
					</div>
				</li>
			)
		}
	)
)
