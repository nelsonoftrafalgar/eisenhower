import React, {
	ChangeEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react'

import { saveDateToStorage } from '@/utils/storage'

interface AddProps {
	handleAddItem: (item: string) => void
}

export const Add = ({ handleAddItem }: AddProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [addMode, setAddMode] = useState(false)
	const [value, setValue] = useState('')

	const enableAddMode = () => {
		setAddMode(true)
	}

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setValue(e.currentTarget.value)
	}

	const addItem = () => {
		setValue('')
		setAddMode(false)
		if (value) {
			handleAddItem(value)
			saveDateToStorage(value)
		}
	}

	const handleAdd: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			addItem()
		}

		if (e.key === 'Escape') {
			setAddMode(false)
			setValue('')
		}
	}

	useEffect(() => {
		if (addMode) inputRef.current?.focus()
	}, [addMode])

	return (
		<div>
			{addMode ? (
				<input
					ref={inputRef}
					onChange={handleInputChange}
					value={value}
					onKeyDown={handleAdd}
					onBlur={addItem}
					className='add-input'
					type='text'
				/>
			) : (
				<button onClick={enableAddMode} className='add-button'>
					<span>+</span> Add
				</button>
			)}
		</div>
	)
}
