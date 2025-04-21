import '../page.css'

import { MultipleContainers } from '@/dnd/MultipleContainers'

export default function Test() {
	return (
		<div className='master'>
			<div className='important'>IMPORTANT</div>
			<div className='urgent'>
				<span>URGENT</span>
			</div>
			<div className='grid'>
				<MultipleContainers />
			</div>
			<div className='not-urgent'>
				<span>NOT URGENT</span>
			</div>
			<div className='not-important'>NOT IMPORTANT</div>
		</div>
	)
}
