import './globals.css'

import { Geist, Geist_Mono } from 'next/font/google'

import type { Metadata } from 'next'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

const metadataBase = new URL('https://eisenhowermatrix.org')

export const metadata: Metadata = {
	metadataBase,
	title: {
		default: 'Eisenhower Matrix',
		template: '%s | Eisenhower Matrix'
	},
	description:
		'Easily organize your tasks by urgency and importance using the Eisenhower Matrix. Prioritize what truly matters and boost your productivity.',
	keywords: [
		'eisenhower matrix',
		'priority matrix',
		'task management',
		'productivity',
		'prioritization',
		'time management',
		'urgency vs importance'
	],
	openGraph: {
		title: 'Eisenhower Matrix',
		description:
			'Organize tasks by urgency and importance. Maximize your time with the Eisenhower Matrix.',
		siteName: 'Eisenhower Matrix',
		type: 'website',
		url: 'https://eisenhowermatrix.org',
		locale: 'en_US'
	},
	robots: {
		index: true,
		follow: true
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico'
	},
	alternates: {
		canonical: 'https://eisenhowermatrix.org'
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				{children}
			</body>
		</html>
	)
}
