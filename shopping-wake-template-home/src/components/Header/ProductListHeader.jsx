import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { VIEW_MODE } from '../../utils/Constants'

import arrowLeft from '../../assets/images/arrow_left_search.svg'
import singleModeIcon from '../../assets/images/single_mode_icon.svg'
import doubleModeIcon from '../../assets/images/double_mode_icon.svg'
import gridModeIcon from '../../assets/images/grid_mode_icon.svg'

export default function ProductListHeader(props) {
	const { title, totalProducts, activeViewMode, onClickBack, onClickViewMode } = props

	const lineActiveViewMode = () => (
		<View
			className=' absolute bottom-[0] bg-gray-500'
			width={'6px'}
			height={'1px'}
		/>
	)

	return (
		<View
			id='header'
			className='flex flex-row justify-center items-center w-full relative py-2'>
			<View
				width={'calc(100% - 170px)'}
				className='flex flex-col items-center justify-center flex-wrap'>
				<Text className={`text-sm text-center font-medium break-words line-clamp-1`}>{title}</Text>

				{totalProducts > 0 && (
					<Text className={`text-xs text-center truncate font-light`}>
						{totalProducts > 1 ? `${totalProducts} itens` : `${totalProducts} item`}
					</Text>
				)}
			</View>

			<View className='absolute zindex-2 top-0 bottom-0 w-full flex flex-row items-center justify-between'>
				<View
					className='pl-3'
					onClick={onClickBack}>
					<Image
						loading='lazy'
						src={arrowLeft}
						width={16}
						height={16}
					/>
				</View>

				<View className='flex flex-row items-center justify-end pr-3'>
					<View
						className='flex justify-center p-1 relative'
						onClick={() => onClickViewMode(VIEW_MODE.SINGLE)}>
						<Image
							src={singleModeIcon}
							width={16}
							height={16}
							alt='Modo com 1 visualização'
						/>

						{activeViewMode === VIEW_MODE.SINGLE && lineActiveViewMode()}
					</View>

					<View
						className='flex justify-center p-1 relative'
						onClick={() => onClickViewMode(VIEW_MODE.DOUBLE)}>
						<Image
							src={doubleModeIcon}
							width={16}
							height={16}
							alt='Modo com 2 visualizações'
						/>

						{activeViewMode === VIEW_MODE.DOUBLE && lineActiveViewMode()}
					</View>

					<View
						className='flex justify-center p-1 relative'
						onClick={() => onClickViewMode(VIEW_MODE.GRID)}>
						<Image
							src={gridModeIcon}
							width={16}
							height={16}
							alt='Modo com 4 visualizações'
						/>

						{activeViewMode === VIEW_MODE.GRID && lineActiveViewMode()}
					</View>
				</View>
			</View>
		</View>
	)
}
