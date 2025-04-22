import './globals.css'

import { Geist, Geist_Mono } from 'next/font/google'

import { GoogleAnalytics } from '@next/third-parties/google'
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
		default: 'Free Online Eisenhower Matrix | No Login Required',
		template: '%s | Eisenhower Matrix'
	},
	description:
		'Use the free online Eisenhower Matrix to manage your tasks by urgency and importance — no login required. This priority matrix helps you improve time management and boost productivity through smart task prioritization.',
	keywords: [
		'eisenhower matrix',
		'priority matrix',
		'task management',
		'productivity',
		'prioritization',
		'time management',
		'urgency vs importance',
		'free online',
		'no login required'
	],
	openGraph: {
		title: 'Free Online Eisenhower Matrix | No Login Required',
		description:
			'Organize tasks by urgency and importance. Maximize your productivity with the Eisenhower Matrix.',
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
	},
	verification: {
		google: 'kyCqMEY3EdvTgZFHIxnqbPEY8a3B-ttlta2IQ38KcG4'
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const gaId = process.env.NODE_ENV === 'production' ? 'G-ZW72YKZTET' : ''
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				{children}
			</body>
			<GoogleAnalytics gaId={gaId} />
		</html>
	)
}
