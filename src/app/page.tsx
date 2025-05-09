import './page.css'

import { ClientErrorTracker } from '@/components/ClientErrorTracker'
import { Matrix } from '@/components/Matrix'

export default function Home() {
	return (
		<ClientErrorTracker>
			<h1 className='title'>EISENHOWER MATRIX</h1>
			<div className='master'>
				<div className='important'>IMPORTANT</div>
				<div className='urgent'>
					<span>URGENT</span>
				</div>
				<div className='grid'>
					<Matrix />
				</div>
				<div className='not-urgent'>
					<span>NOT URGENT</span>
				</div>
				<div className='not-important'>NOT IMPORTANT</div>
			</div>
		</ClientErrorTracker>
	)
}
