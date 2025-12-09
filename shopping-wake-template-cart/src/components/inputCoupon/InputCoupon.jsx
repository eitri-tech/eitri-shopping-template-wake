import { formatCurrency } from '../../utils/Util'
import { LoadingComponent } from 'shopping-wake-template-shared'
import { useState } from 'react'
import { View, Text, TextInput, Button, Image } from 'eitri-luminus'

export default function InputCoupon(props) {
	const { addAction, removeAction, appliedCoupon, couponDiscount, loading, msgError } = props
	const [coupon, setCoupon] = useState('')

	const addCoupon = async () => {
		try {
			if (coupon.trim().length === 0) {
				return
			}
			return await addAction(coupon)
		} catch (e) {
			console.log(e)
		}
	}

	const removeCoupon = async () => {
		return await removeAction(appliedCoupon)
	}

	return (
		<View>
			{!!appliedCoupon ? (
				<View className=''>
					<View className='flex items-center justify-between'>
						<View className='flex flex-row items-center gap-2'>
							<View className='flex flex-col'>
								<Text className='text-primary-500 text-sm'>Cupom aplicado:</Text>
								<View className='flex flex-row justify-start items-center gap-1'>
									<View>
										<Image
											width={16}
											height={16}
											iconKey='tag'
										/>
									</View>
									<Text className='text-sm font-light'>{appliedCoupon}</Text>
								</View>
							</View>
						</View>
						{couponDiscount !== 0 ? (
							<View className='flex flex-row items-center'>
								<Text className='text-sm'>{formatCurrency(couponDiscount)}</Text>
								<View
									onPress={removeCoupon}
									className='py-1 pl-4'>
									<Image
										width={18}
										height={18}
										iconKey='x'
									/>
								</View>
							</View>
						) : (
							<View
								onPress={removeCoupon}
								className='flex flex-row items-center justify-end'>
								<Text>Remover</Text>
							</View>
						)}
					</View>
				</View>
			) : (
				<View className=''>
					<View className='flex flex-col gap-1 items-center'>
						<View className='grid grid-cols-5 gap-2 items-center w-full max-w-xs mx-auto'>
							<TextInput
								className='col-span-4 h-[32px] border border-neutral-300 rounded-md px-2 text-sm bg-white outline-none focus:border-black transition-colors duration-150 w-full flex items-center'
								value={coupon}
								onChange={e => setCoupon(e.target.value)}
								onSubmit={addCoupon}
							/>
							<View
								className='col-span-1 h-[32px] min-w-[40px] px-2 bg-black text-white flex items-center justify-center rounded-md cursor-pointer transition-colors duration-150 hover:bg-meteorite-01 w-full'
								onClick={addCoupon}>
								<svg
									width='18'
									height='18'
									viewBox='0 0 20 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										d='M5 10.5L9 14.5L15 7.5'
										stroke='white'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</View>
						</View>
					</View>

					{loading && (
						<View className='flex flex-row items-center justify-end pt-2'>
							<Text className='mr-4 text-sm'>Adicionando cupom</Text>
							<LoadingComponent
								width={10}
								height={10}
							/>
						</View>
					)}

					{msgError && (
						<View className='flex flex-row items-center justify-start pt-2'>
							<Text className='text-red-600 text-sm'>{msgError}</Text>
						</View>
					)}
				</View>
			)}
		</View>
	)
}
