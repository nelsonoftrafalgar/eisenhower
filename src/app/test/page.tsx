import '../page.css'

import { MultipleContainers } from '@/dnd/MultipleContainers'

export default function Test() {
	return (
		<MultipleContainers
			containerStyle={{
				maxHeight: '80vh'
			}}
			itemCount={15}
			scrollable
		/>
	)
}
