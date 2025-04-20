import React, {
	ChangeEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react'

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

	const handleBlur = () => {
		setAddMode(false)
		setValue('')
	}

	const handleAdd: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			setAddMode(false)
			handleAddItem(value)
			setValue('')
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
		<div className='add'>
			{addMode ? (
				<input
					ref={inputRef}
					onChange={handleInputChange}
					value={value}
					onKeyDown={handleAdd}
					onBlur={handleBlur}
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
