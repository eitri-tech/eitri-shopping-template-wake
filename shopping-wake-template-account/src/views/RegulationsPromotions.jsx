import { Accordion, Page, Text, View } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'
import { detailsPromotions } from '../utils/regulationsPromotions'

export default function RegulationsPromotions() {
	const PAGE = 'Regulamentos e promoções'

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

			<View className='flex flex-col gap-4 p-4 mt-12'>
				{detailsPromotions.map((item, idx) => (
					<Accordion
						key={idx}
						name='regulations-accordion'
						className='collapse-arrow border-b border-gray-200 pb-4 !rounded-none'>
						<Accordion.Title className='flex items-center !p-0 !min-h-6 text-xs'>
							{item?.title}
						</Accordion.Title>

						<Accordion.Content className='flex flex-col gap-2 !p-0'>
							{item?.description.map((desc, dIdx) => (
								<Text
									key={dIdx}
									className='w-full text-xs font-light'>
									{desc}
								</Text>
							))}
						</Accordion.Content>
					</Accordion>
				))}

				<Contact />
			</View>
		</Page>
	)
}
