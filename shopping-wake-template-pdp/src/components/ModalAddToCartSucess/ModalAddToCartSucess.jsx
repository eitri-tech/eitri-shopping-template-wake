import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { formatImageUrl } from '../../utils/Util'

export default function ModalAddToCartSucess(props) {
	const { show, setShow, navigateCart } = props

	const { cart } = useLocalShoppingCart()

	return (
		<Modal
			show={show}
			position={'bottom'}
			onClose={() => Eitri.navigation.close()}>
			<View
				display='flex'
				direction='column'
				backgroundColor='accent-100'
				alignItems='center'
				borderRadius='none'
				borderColor='neutral-300'
				width='100vw'
				paddingTop='medium'
				borderRadiusLeftTop='small'
				borderRadiusRightTop='small'>
				<View
					width='100%'
					direction='row'
					justifyContent='between'
					alignItems='center'
					paddingHorizontal='large'
					paddingBottom='medium'>
					<Text
						fontSize='medium'
						fontWeight='bold'>
						Produto Adicionado
					</Text>
					<View onClick={() => Eitri.navigation.close()}>{/*<Icon iconKey='x'/>*/}</View>
				</View>

				<View
					display='flex'
					direction='column'
					paddingBottom='large'
					width='100%'
					paddingHorizontal='large'>
					<Text fontSize='extra-small'>Estes são os produtos que estão no seu carrinho</Text>

					<View
						width='100%'
						direction='row'
						gap={8}
						marginTop='small'>
						{cart?.products.slice(0, 3).map((item, index) => (
							<Image
								key={index}
								maxWidth='64px'
								maxHeight='80px'
								borderRadius='small'
								src={formatImageUrl(item.imageUrl)}
							/>
						))}

						{cart?.products.length > 3 && (
							<View
								width='50px'
								height='80px'
								borderRadius='small'
								backgroundColor='neutral-300'
								direction='column'
								alignItems='center'
								justifyContent='center'>
								<Text
									color='white'
									fontWeight='bold'
									textAlign='center'>
									+{cart.products.length - 3}
								</Text>
							</View>
						)}
					</View>

					<View
						direction='row'
						gap={8}
						width='100%'
						marginTop='large'>
						<View
							onClick={() => Eitri.navigation.close()}
							paddingVertical='small'
							borderRadius='small'
							width='100%'
							borderWidth='hairline'
							borderColor='primary-100'
							direction='row'
							justifyContent='center'
							alignItems='center'>
							<Text
								fontWeight='bold'
								fontSize='small'
								color='primary-100'
								textAlign='center'>
								Continuar comprando
							</Text>
						</View>

						<View
							onClick={() => {
								setShow(false)
								navigateCart()
							}}
							paddingVertical='small'
							borderRadius='small'
							width='100%'
							backgroundColor='primary-100'
							direction='row'
							justifyContent='center'
							alignItems='center'>
							<Text
								fontWeight='bold'
								fontSize='small'
								color='secondary-100'
								textAlign='center'>
								Ir para a carrinho
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View bottomInset />
		</Modal>
	)
}
