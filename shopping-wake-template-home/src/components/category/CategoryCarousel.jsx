import Eitri from 'eitri-bifrost'
import { formatImageUrl } from '../../utils/Util'

export default function CategoryCarousel(props) {
	async function goToCategory() {
		console.log('Redirecionando para produto...')
	}

	// Testa na home com <CategoryCarousel categories={categoriesMock}/>

	return (
		<Carousel>
			{props.categories.map(category => {
				return (
					<View
						position='relative'
						padding='none'
						width='100vw'
						direction='row'
						justifyContent='center'
						alignItems='center'>
						<Image
							src={formatImageUrl(category.images.at(0).url)}
							height='65vh'
						/>
						<View
							maxWidth='65%'
							position='absolute'
							direction='column'
							height='65%'
							justifyContent='end'
							alignItems='center'>
							<Text
								textTransform='uppercase'
								variant='h4'
								marginBottom='big'
								color='neutral-100'>
								{category.categoryName}
							</Text>
							<View onClick={goToCategory}>
								<Text
									fontSize='extra-small'
									color='neutral-100'>
									VER MAIS
								</Text>
							</View>
						</View>
					</View>
				)
			})}
		</Carousel>
	)
}
