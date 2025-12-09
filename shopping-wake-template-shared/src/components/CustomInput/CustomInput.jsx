import Eitri from 'eitri-bifrost'
import { useState } from 'react'
import EyeClose from '../../assets/icons/eye-close.svg'
import EyeOpen from '../../assets/icons/eye-open.svg'
import { TextInput } from 'eitri-luminus'

export default function CustomInput(props) {
	const { icon, type, backgroundColor, width, label, height, onChange, value, error, className, onFocus, ...rest } =
		props

	const [showPassword, setShowPassword] = useState(false)

	const handleFocus = e => {
		Eitri.keyboard.setVisibilityListener(status => {
			if (status.code === 'keyboardDidShow') {
				e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
			Eitri.keyboard.clearVisibilityListener()
		})

		e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })

		if (typeof onFocus === 'function') {
			onFocus(e)
		}
	}

	return (
		<View className='w-full'>
			{label && (
				<View className='mb-1'>
					<Text className='text-sm'>{label}</Text>
				</View>
			)}

			<View className={`relative ${error ? 'border-red-500' : 'border-primary-500'} px-2 bg-[#e8f0fe]`}>
				<TextInput
					className={`
					border-none 
					outline-none 
					bg-transparent 
					text-sm
					text-primary-500
					placeholder:text-primary-500
					h-9
					w-full 
					!outline-none
					!p-0
					!rounded-none 
					focus:!outline-none
					focus:!outline-color
					focus:!ring-0 
					focus-within:!ring-0 
					focus-within:!base-100  
					${className || ''}`}
					type={showPassword ? 'text' : type || 'text'}
					placeholderTextColor='gray'
					placeholder=''
					autoComplete='off'
					onChange={onChange}
					value={value}
					onFocus={handleFocus}
					{...rest}
				/>

				{type === 'password' && (
					<View
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'>
						{showPassword ? (
							<Image
								src={EyeOpen}
								alt='Ícone de olho aberto'
							/>
						) : (
							<Image
								src={EyeClose}
								alt='Ícone de olho fechado'
							/>
						)}
					</View>
				)}
			</View>

			{error && (
				<View className='mt-1'>
					<Text className='text-[10px] text-error'>{error}</Text>
				</View>
			)}
		</View>
	)
}
