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

import Delete from '../../assets/delete.svg'
import DragHandle from '../../assets/drag-handle.svg'
import Image from 'next/image'
import type { Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import styles from './Item.module.css'

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

			return (
				<li
					className={classNames(styles.wrapper)}
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
						<Image fill src={DragHandle} alt='Drag and drop icon' />
					</div>
					<div className={classNames(styles.item)} style={style} {...props}>
						{isEditMode ? (
							<input
								ref={inputRef}
								className={styles.editInput}
								type='text'
								value={inputValue}
								onBlur={handleItemSave}
								onChange={handleValueChange}
								onKeyDown={handleKeyDown}
							/>
						) : (
							<span onClick={openEditMode} className={styles.value}>
								{value}
							</span>
						)}
						<div className={styles.menu}>
							<div
								onClick={() => handleDeleteItem?.(value)}
								className={styles.menuIcon}
							>
								<Image width={15} height={15} src={Delete} alt='Delete icon' />
							</div>
						</div>
					</div>
				</li>
			)
		}
	)
)
