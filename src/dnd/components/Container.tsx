import React, { forwardRef } from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'
import classNames from 'classnames'
import styles from './Container.module.css'

export interface ContainerProps {
	children: React.ReactNode
	columns?: number
	style?: React.CSSProperties
	id: UniqueIdentifier
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
	({ children, columns = 1, style, id, ...props }: ContainerProps, ref) => {
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
				<h2>{id.toString().toUpperCase()}</h2>
				<ul>{children}</ul>
			</div>
		)
	}
)

Container.displayName = 'Container'

export default Container
