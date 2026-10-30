import { useState, useRef, useCallback, useEffect } from 'react'
import { formatCurrency } from '../../../utils/Util'

/*
	Slider de faixa de preço com dois polegares. Os limites vêm das
	agregações da busca (minimumPrice/maximumPrice do resultado atual).
**/
export default function PriceRange(props) {
	const { rangeMin, rangeMax, initialMin, initialMax, onChange } = props

	const [minValue, setMinValue] = useState(initialMin ?? rangeMin)
	const [maxValue, setMaxValue] = useState(initialMax ?? rangeMax)
	const [dragging, setDragging] = useState(null)

	const minValueRef = useRef(minValue)
	const maxValueRef = useRef(maxValue)

	const step = 1

	useEffect(() => {
		const min = initialMin ?? rangeMin
		const max = initialMax ?? rangeMax

		setMinValue(min)
		setMaxValue(max)
		minValueRef.current = min
		maxValueRef.current = max
	}, [initialMin, initialMax, rangeMin, rangeMax])

	const valorPelaPosicao = useCallback(
		clientX => {
			const trilha = document.getElementById('price-range-track')

			if (!trilha) return rangeMin

			const rect = trilha.getBoundingClientRect()
			const proporcao = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
			const valor = Math.round((proporcao * (rangeMax - rangeMin) + rangeMin) / step) * step

			return Math.max(rangeMin, Math.min(rangeMax, valor))
		},
		[rangeMin, rangeMax]
	)

	const aoTocar = polegar => e => {
		e.preventDefault()
		e.stopPropagation()
		setDragging(polegar)

		const aoArrastar = evento => {
			const valor = valorPelaPosicao(evento.touches[0].clientX)

			if (polegar === 'min') {
				const limitado = Math.min(valor, maxValueRef.current - step)

				setMinValue(limitado)
				minValueRef.current = limitado
			} else {
				const limitado = Math.max(valor, minValueRef.current + step)

				setMaxValue(limitado)
				maxValueRef.current = limitado
			}
		}

		const aoSoltar = () => {
			setDragging(null)
			document.removeEventListener('touchmove', aoArrastar)
			document.removeEventListener('touchend', aoSoltar)

			if (onChange) {
				onChange({ min: minValueRef.current, max: maxValueRef.current })
			}
		}

		document.addEventListener('touchmove', aoArrastar)
		document.addEventListener('touchend', aoSoltar)
	}

	if (!rangeMax || rangeMax <= rangeMin) {
		return null
	}

	const percentualMin = ((minValue - rangeMin) / (rangeMax - rangeMin)) * 100
	const percentualMax = ((maxValue - rangeMin) / (rangeMax - rangeMin)) * 100

	return (
		<View className='flex flex-col w-full py-4'>
			<View className='relative flex items-center h-6 px-3'>
				<View
					id='price-range-track'
					className='relative w-full h-1 bg-neutral-300 rounded-full'>
					<View
						className='absolute h-1 bg-primary rounded-full'
						style={{ left: `${percentualMin}%`, width: `${percentualMax - percentualMin}%` }}
					/>

					<View
						className={`absolute w-6 h-6 bg-white border-2 border-primary rounded-full ${
							dragging === 'min' ? 'shadow-lg' : ''
						}`}
						style={{
							left: `${percentualMin}%`,
							transform: 'translateX(-50%) translateY(-50%)',
							top: '50%'
						}}
						onTouchStart={aoTocar('min')}
					/>

					<View
						className={`absolute w-6 h-6 bg-white border-2 border-primary rounded-full ${
							dragging === 'max' ? 'shadow-lg' : ''
						}`}
						style={{
							left: `${percentualMax}%`,
							transform: 'translateX(-50%) translateY(-50%)',
							top: '50%'
						}}
						onTouchStart={aoTocar('max')}
					/>
				</View>
			</View>

			<View className='flex justify-between mt-2 px-1'>
				<Text className='text-xs text-neutral-content'>{formatCurrency(rangeMin)}</Text>
				<Text className='text-xs text-neutral-content'>{formatCurrency((rangeMin + rangeMax) / 2)}</Text>
				<Text className='text-xs text-neutral-content'>{formatCurrency(rangeMax)}</Text>
			</View>

			<View className='flex justify-between mt-4'>
				<View className='flex flex-col'>
					<Text className='block text-base-content'>Valor Mínimo</Text>
					<Text className='block mt-1 font-bold text-base-content'>{formatCurrency(minValue)}</Text>
				</View>

				<View className='flex flex-col items-end'>
					<Text className='block text-base-content'>Valor Máximo</Text>
					<Text className='block mt-1 font-bold text-base-content'>{formatCurrency(maxValue)}</Text>
				</View>
			</View>
		</View>
	)
}
