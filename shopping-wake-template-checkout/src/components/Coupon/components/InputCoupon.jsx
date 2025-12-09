import { formatCurrency } from '../../../utils/Util'
import { LoadingComponent, CustomInput, CustomButton } from 'shopping-wake-template-shared'
import { useState } from 'react'

export default function InputCoupon(props) {
	const { addAction, removeAction, appliedCoupon, couponDiscount, loading, msgError } = props

	const [coupon, setCoupon] = useState('')

	const addCoupon = async () => {
		if (coupon.trim().length === 0) {
			return
		}
		const result = await addAction(coupon)
		setCoupon('')
		return result
	}

	const removeCoupon = async () => {
		setCoupon('')
		return await removeAction(appliedCoupon)
	}

	return (
		<View className='my-4'>
			{!!appliedCoupon ? (
				// --- Applied Coupon State ---
				<View className='space-y-2'>
					<Text className='text-sm font-semibold text-gray-700'>Cupom Aplicado</Text>

					<View className='flex items-center justify-between border p-3'>
						<View className='flex items-center gap-2'>
							<Text className='font-bold text-sm'>{appliedCoupon}</Text>
						</View>

						<View className='flex items-center gap-3'>
							{couponDiscount !== 0 && (
								<Text className='font-bold text-sm'>-{formatCurrency(couponDiscount)}</Text>
							)}
							<View
								onClick={removeCoupon}
								className='cursor-pointer'>
								<Text className='text-xs'>Remover</Text>
							</View>
						</View>
					</View>
				</View>
			) : (
				// --- Input Coupon State ---
				<View className='flex flex-col'>
					<Text className='text-sm font-semibold'>Cupom de Desconto</Text>

					<View className='flex gap-2'>
						<CustomInput
							value={coupon}
							onChange={e => setCoupon(e.target.value)}
						/>

						<CustomButton
							className={'!w-[33%]'}
							disabled={coupon === ''}
							label={'Ok'}
							onClick={addCoupon}
						/>
					</View>
				</View>
			)}

			{/* --- Loading State --*/}
			{loading && (
				<View className='mt-2 flex items-center justify-end gap-2'>
					<Text className='text-sm text-gray-600'>Aplicando cupom...</Text>
					<LoadingComponent
						width={16}
						height={16}
					/>
				</View>
			)}

			{/* --- Error State --*/}
			{msgError && (
				<View className='mt-2 flex items-center justify-start gap-2'>
					<Text className='text-sm text-red-600'>{msgError}</Text>
				</View>
			)}
		</View>
	)
}
