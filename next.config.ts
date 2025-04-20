import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: './dist', // Changes the build output directory to `./dist/`.
	webpack(config: NextConfig) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack']
		})
		return config
	}
}

export default nextConfig
