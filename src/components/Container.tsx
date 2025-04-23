import React, { forwardRef } from 'react'

import { ClearAll } from '../icons/ClearAll'
import { UniqueIdentifier } from '@dnd-kit/core'
import { clearDatesInStorage } from '@/utils/storage'

export interface ContainerProps {
	children: React.ReactNode
	columns?: number
	style?: React.CSSProperties
	id: UniqueIdentifier
	items: UniqueIdentifier[]
	handleClearAll: () => void
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
	(
		{
			children,
			columns = 1,
			style,
			id,
			handleClearAll,
			items,
			...props
		}: ContainerProps,
		ref
	) => {
		const clearAll = () => {
			handleClearAll()
			clearDatesInStorage(items)
		}

		return (
			<div
				{...props}
				ref={ref}
				style={
					{
						...style,
						'--columns': columns
					} as React.CSSProperties
				}
				className={`container ${id}`}
			>
				<div className='header'>
					<h2>{id.toString().toUpperCase()}</h2>
					<button onClick={clearAll} className='clear-all-button'>
						<ClearAll />
					</button>
				</div>
				<ul>{children}</ul>
			</div>
		)
	}
)

Container.displayName = 'Container'

export default Container
