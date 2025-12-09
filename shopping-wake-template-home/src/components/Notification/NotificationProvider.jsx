import React, { createContext, useContext, useState } from 'react'
import { View, Text } from 'eitri-luminus'

const NotificationContext = createContext()

export function useNotification() {
	return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
	const [visible, setVisible] = useState(false)
	const [animating, setAnimating] = useState(false)

	const showNotification = () => {
		setVisible(true)
		setTimeout(() => {
			setAnimating(true)
			setTimeout(() => {
				setAnimating(false)
				setTimeout(() => {
					setVisible(false)
				}, 1200)
			}, 5000)
		}, 50)
	}

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			<View className='relative'>
				{visible && (
					<View
						className={`fixed left-0 right-0 z-[9999] flex justify-center items-start pointer-events-none transition-[top] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] max-w-full h-0 ${animating ? 'top-[50px]' : '-top-[120px]'}`}>
						<View className='flex flex-row items-stretch min-w-[260px] max-w-[calc(100vw-24px)] pointer-events-auto'>
							{/* Linha preta no canto esquerdo */}
							<View
								className='w-2 bg-gray-600 rounded-l-lg'
								style={{ minHeight: 44 }}
							/>
							<View className='bg-white shadow-md flex flex-col justify-center px-4 py-2 min-h-[44px] max-w-[360px] w-full rounded-r-lg'>
								<Text className='text-left text-xs font-bold text-neutral-900 mb-1'>
									Produto adicionado com sucesso!
								</Text>
								<Text className='text-left text-[9px] text-neutral-900 mt-1'>
									O item foi adicionado à sua sacola.
								</Text>
							</View>
						</View>
					</View>
				)}
				{children}
			</View>
		</NotificationContext.Provider>
	)
}
