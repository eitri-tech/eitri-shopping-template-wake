import { CustomButton, HeaderReturn, HeaderContentWrapper, CustomInput } from 'shopping-wake-template-shared'
import { useCheckout } from '../providers/UseCheckout'
import Eitri from 'eitri-bifrost'
import BottomFixed from '../components/BottomFixed/BottomFixed'
import { logScreenView } from '../services/TrackingService'
import { errorFormatValue } from '../utils/AddCardUtil'
import { useEffect, useState } from 'react'
import { UF } from '../utils/Constants'

export default function AddCard() {
	const PAGE = 'Checkout - Adicionar Cartão de Crédito'

	const { getInstallments, creditCardData, setCreditCardData } = useCheckout()
	const [installments, setInstallments] = useState([])

	const [objectExpirationDate, setObjectExpirationDate] = useState({ month: '', year: '' })
	const [cardErrors, setCardErrors] = useState({
		number: false,
		holderName: false,
		expirationDate: false,
		document: false,
		securityCode: false
	})
	const [months, setMonths] = useState([])
	const [years, setYears] = useState([])

	useEffect(() => {
		const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
		const currentYear = new Date().getFullYear()
		const years = Array.from({ length: 30 }, (_, i) => String(currentYear + i))

		setMonths(months)
		setYears(years)

		if (creditCardData.expirationDate) {
			const [month, year] = creditCardData.expirationDate.split('/')
			setObjectExpirationDate({ month, year })
		}

		getInstallments().then(_installments => {
			setInstallments(_installments)
			if (!creditCardData.installments) {
				handleInput('installments', 1)
			}
		})
		logScreenView(PAGE, 'AddCard')
	}, [])

	useEffect(() => {
		if (objectExpirationDate.month !== '' && objectExpirationDate.year !== '') {
			const expirationDate = `${objectExpirationDate.month}/${objectExpirationDate.year}`
			handleInput('expirationDate', expirationDate)
			const result = errorFormatValue('expirationDate', expirationDate)
			setCardErrors(prev => ({ ...prev, expirationDate: result }))
		}
	}, [objectExpirationDate])

	useEffect(() => {
		const errors = {
			number: errorFormatValue('number', creditCardData.number),
			holderName: errorFormatValue('holderName', creditCardData.holderName),
			expirationDate: errorFormatValue('expirationDate', creditCardData.expirationDate),
			document: errorFormatValue('document', creditCardData.document),
			securityCode: errorFormatValue('securityCode', creditCardData.securityCode)
		}
		setCardErrors(errors)
	}, [creditCardData])

	const handleInput = (key, value) => {
		setCreditCardData(prev => ({ ...prev, [key]: value }))
	}

	const handleSubmit = () => {
		if (isValidForm()) {
			Eitri.navigation.navigate({ path: 'OrderRevision' })
		}
	}

	const isValidForm = () => {
		return Object.values(cardErrors).every(error => !error)
	}

	const hanldeDate = (type, value) => {
		setObjectExpirationDate(prev => ({ ...prev, [type]: value }))
	}

	const onBlur = field => {
		const result = errorFormatValue(field, creditCardData[field])
		setCardErrors(prev => ({ ...prev, [field]: result }))
	}

	const onFocus = field => {
		setCardErrors(prev => ({ ...prev, [field]: false }))
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<View className='flex flex-col gap-4 p-4'>
				<CustomInput
					label='Número do cartão'
					placeholder='0000 0000 0000 0000'
					variant='mask'
					mask='9999 9999 9999 9999'
					inputMode='numeric'
					value={creditCardData.number}
					onChange={e => handleInput('number', e.target.value)}
					hasError={cardErrors.number}
					onBlur={() => onBlur('number')}
					onFocus={() => onFocus('number')}
				/>
				<CustomInput
					label='Nome impresso no cartão'
					placeHolder='Como está no cartão'
					value={creditCardData.holderName}
					onChange={e => handleInput('holderName', e.target.value)}
					hasError={cardErrors.holderName}
					onBlur={() => onBlur('holderName')}
					onFocus={() => onFocus('holderName')}
				/>

				<View className='grid grid-cols-3 items-end gap-4'>
					<View className='col-span-2'>
						<Text className='text-sm'>Validade</Text>
						<View className='flex items-end gap-2'>
							<Select
								onChange={e => hanldeDate('month', e.target.value)}
								value={objectExpirationDate.state}
								placeholder='Mês'
								className='w-full h-9 !min-h-0 !bg-[#e8f0fe] !rounded-none !border-none'>
								{months.map(month => (
									<Select.Item
										key={month}
										value={month}>
										{month}
									</Select.Item>
								))}
							</Select>
							<Text className='text-gray-500'>/</Text>
							<Select
								onChange={e => hanldeDate('year', e.target.value)}
								value={objectExpirationDate.year}
								placeholder='Ano'
								className='w-full h-9 !min-h-0 !bg-[#e8f0fe] !rounded-none !border-none'>
								{years.map(years => (
									<Select.Item
										key={years}
										value={years}>
										{years}
									</Select.Item>
								))}
							</Select>
						</View>
						{/*{cardErrors.expirationDate && (*/}
						{/*	<Text className='mt-1 text-xs italic text-red-600'>Data inválida</Text>*/}
						{/*)}*/}
					</View>

					<CustomInput
						label='CVV'
						placeholder='123'
						inputMode='numeric'
						mask='9999'
						variant='mask'
						value={creditCardData.securityCode}
						onChange={e => handleInput('securityCode', e.target.value)}
						hasError={cardErrors.securityCode}
						onBlur={() => onBlur('securityCode')}
						onFocus={() => onFocus('securityCode')}
					/>
				</View>

				<View className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<CustomInput
						label='CPF do titular'
						placeHolder='000.000.000-00'
						inputMode='numeric'
						mask='999.999.999-99'
						variant='mask'
						value={creditCardData.document}
						onChange={e => handleInput('document', e.target.value)}
						hasError={cardErrors.document}
						onBlur={() => onBlur('document')}
						onFocus={() => onFocus('document')}
					/>
					<Select
						onChange={e => handleInput('installments', e.target.value)}
						value={creditCardData.installments}
						placeholder='Parcelas'
						className='w-full h-9 !min-h-0 !bg-[#e8f0fe] !rounded-none !border-none'>
						{installments.map(inst => (
							<Select.Item
								key={inst.number}
								value={inst.number}>
								{`${inst.number}x de ${inst.formatedValue}`}
							</Select.Item>
						))}
					</Select>
				</View>
			</View>

			<BottomFixed>
				<CustomButton
					disabled={!isValidForm()}
					onClick={handleSubmit}
					label='Usar cartão de crédito'
				/>
			</BottomFixed>
		</Page>
	)
}
