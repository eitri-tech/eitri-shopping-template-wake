import MapIcon from './components/MapIcon'
import DollarSignIcon from './components/DollarSignIcon'
import AlignLeftIcon from './components/AlignLeftIcon'

export default function StepIndicator(props) {
	const { currentStep } = props

	const STEPS = [
		{
			title: 'Endereço',
			icon: MapIcon
		},
		{
			title: 'Pagamento',
			icon: DollarSignIcon
		},
		{
			title: 'Revisão',
			icon: AlignLeftIcon
		}
	]

	const renderIcon = (comp, className) => {
		const Component = comp
		return <Component className={className} />
	}

	const current = currentStep || 0

	return (
		<View className='h-[4px] w-full bg-meteorite-04'>
			<View
				className='h-full bg-meteorite-01 transition-[width,background-color] duration-300 ease-in-out'
				height='100%'
				width={`${(currentStep / STEPS?.length) * 100}%`}
			/>
		</View>
	)

	return (
		<View className='px-5 py-2'>
			<View className='flex justify-center'>
				{STEPS.map((step, index) => {
					const stepNumber = index + 1
					const isActive = stepNumber <= current
					return (
						<View
							key={index}
							className='relative flex flex-1 flex-col items-center gap-2'>
							{index < STEPS.length - 1 && (
								<View className={`absolute left-1/2 top-5 w-full border-t-2 border-meteorite-01`} />
							)}

							{/* Step Circle */}
							<View
								className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-meteorite-01 ${
									isActive ? 'bg-primary' : 'bg-base-100'
								}`}>
								{renderIcon(step.icon, isActive ? 'text-base-100' : 'text-primary')}
							</View>

							{/* Step Title */}
							<View>
								<Text
									className={`text-sm ${
										isActive ? 'font-semibold text-primary-500' : 'text-gray-500'
									}`}>
									{step.title}
								</Text>
							</View>
						</View>
					)
				})}
			</View>
		</View>
	)
}
