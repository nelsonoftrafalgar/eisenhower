'use client'

import { PropsWithChildren, useEffect } from 'react'

export const ClientErrorTracker = ({ children }: PropsWithChildren) => {
	useEffect(() => {
		const handleClientError = (event: ErrorEvent) => {
			window.gtag('event', 'client_error', {
				description: `${event.message}`
			})
		}

		window.addEventListener('error', handleClientError)

		return () => {
			window.removeEventListener('error', handleClientError)
		}
	}, [])

	return <>{children}</>
}
