import React, { forwardRef } from 'react'

import ClearAll from '../../assets/clear-all.svg'
import Image from 'next/image'
import { UniqueIdentifier } from '@dnd-kit/core'
import classNames from 'classnames'
import styles from './Container.module.css'

export interface ContainerProps {
	children: React.ReactNode
	columns?: number
	style?: React.CSSProperties
	id: UniqueIdentifier
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
			...props
		}: ContainerProps,
		ref
	) => {
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
				className={classNames(styles.container, styles[id])}
			>
				<div className={styles.header}>
					<h2>{id.toString().toUpperCase()}</h2>
					<button onClick={handleClearAll} className={styles.clearAllButton}>
						<Image width={15} height={15} src={ClearAll} alt='Clear all icon' />
					</button>
				</div>
				<ul>{children}</ul>
			</div>
		)
	}
)

Container.displayName = 'Container'

export default Container
