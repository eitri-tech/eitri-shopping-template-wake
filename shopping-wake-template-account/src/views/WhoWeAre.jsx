import { HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'

export default function WhoWeAre() {
	const PAGE = 'quem somos'

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper
				className='flex items-center justify-between bg-accent-300 py-2'
				scrollEffect={false}>
				<HeaderReturn />

				<HeaderText
					className='w-fit'
					text={PAGE}
				/>

				<View width={20} />
			</HeaderContentWrapper>

			<View className='flex flex-col'>
				<View className='relative mb-1'>
					<Image
						className='h-full w-full'
						src='https://loja.vtexassets.com/assets/vtex.file-manager-graphql/images/3ee3d5fe-07e5-44ed-bc73-70fbba5248d5___deaaa2b1818c7d517a8b1b45e99c2811.png'
					/>
					<View className='absolute bottom-8 left-4 right-0'>
						<Text className='mb-1 text-2xl text-accent-300'>veste seu tempo.</Text>

						<Text className='text-lg text-accent-300'>
							nossa moda é feita para acompanhar seu momento e todas as suas versões.
						</Text>
					</View>
				</View>

				<Video
					source='https://loja.com.br/cdn/ecommerce/lps/2023/lpquemsomosnovamob.mp4'
					thumbnail='https://loja.vtexassets.com/assets/vtex.file-manager-graphql/images/662c0b0d-3c76-477a-8abc-2071a93fe152___e99cf92b5402932365eedde20a5ec138.png'
					autoPlay
					loop
					muted
					controls={false}
					width='100%'
					height='100%'
				/>

				<Image
					className='h-full w-full'
					src='https://loja.vtexassets.com/assets/vtex.file-manager-graphql/images/f4c905cc-4a45-439c-bfb1-d1a1eb6bfcf4___864fa33936dbc7757db4d8c3ee1cbe79.png'
				/>

				<Image
					className='h-full w-full'
					src='https://loja.vtexassets.com/assets/vtex.file-manager-graphql/images/0c779c38-df61-4c6f-ac4a-b7abbd7e9f49___1e29f5b699e870a675cfbb16dbd3347e.png'
				/>
			</View>
		</Page>
	)
}
