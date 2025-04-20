import React, { forwardRef } from 'react'

import classNames from 'classnames'
import styles from './Container.module.css'

export interface ContainerProps {
	children: React.ReactNode
	columns?: number
	style?: React.CSSProperties
	horizontal?: boolean
	hover?: boolean
	scrollable?: boolean
	shadow?: boolean
	placeholder?: boolean
	unstyled?: boolean
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
	(
		{
			children,
			columns = 1,
			horizontal,
			hover,
			placeholder,
			style,
			scrollable,
			shadow,
			unstyled,
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
				className={classNames(
					styles.Container,
					unstyled && styles.unstyled,
					horizontal && styles.horizontal,
					hover && styles.hover,
					placeholder && styles.placeholder,
					scrollable && styles.scrollable,
					shadow && styles.shadow
				)}
			>
				<ul>{children}</ul>
			</div>
		)
	}
)

Container.displayName = 'Container'

export default Container
