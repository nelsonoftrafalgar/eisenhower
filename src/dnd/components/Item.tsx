import React, { useEffect } from 'react'

import DragHandle from '../../assets/drag-handle.svg'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import Image from 'next/image'
import type { Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import styles from './Item.module.css'

export interface Props {
	dragOverlay?: boolean
	color?: string
	disabled?: boolean
	dragging?: boolean
	height?: number
	index?: number
	fadeIn?: boolean
	transform?: Transform | null
	listeners?: DraggableSyntheticListeners
	sorting?: boolean
	style?: React.CSSProperties
	transition?: string | null
	wrapperStyle?: React.CSSProperties
	value: React.ReactNode
}

export const Item = React.memo(
	React.forwardRef<HTMLLIElement, Props>(
		(
			{
				color,
				dragOverlay,
				index,
				listeners,
				style,
				transition,
				transform,
				value,
				wrapperStyle,
				...props
			},
			ref
		) => {
			useEffect(() => {
				if (!dragOverlay) {
					return
				}

				document.body.style.cursor = 'grabbing'

				return () => {
					document.body.style.cursor = ''
				}
			}, [dragOverlay])

			return (
				<li
					className={classNames(styles.Wrapper)}
					style={
						{
							...wrapperStyle,
							transition: [transition, wrapperStyle?.transition]
								.filter(Boolean)
								.join(', '),
							'--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
							'--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
							'--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
							'--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
							'--index': index,
							'--color': color
						} as React.CSSProperties
					}
					ref={ref}
				>
					<div {...listeners} tabIndex={0} className='drag-icon'>
						<Image fill src={DragHandle} alt='' />
					</div>
					<span className={classNames(styles.Item)} style={style} {...props}>
						{value}
					</span>
				</li>
			)
		}
	)
)
