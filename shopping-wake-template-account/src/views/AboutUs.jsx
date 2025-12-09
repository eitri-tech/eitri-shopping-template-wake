import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'

export default function AboutUs() {
	const PAGE = 'Sobre a Loja'

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>{PAGE}</Text>
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col p-4 gap-4'>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>
						Nossos Produtos
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A nossa loja é uma empresa 100% brasileira que produz e comercializa produtos com a mais alta
						qualidade e estilo! Em nosso e-commerce, você encontra produtos com foco em Moda Fitness,
						Lingerie e Moda Praia, além de calçados variados como botas, tênis, sandálias e outros.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Nosso portfólio conta com mais de 3 mil modelos produzidos através das últimas tendências da
						moda. Oferecemos uma experiência de compra única do começo ao fim: nosso site é fácil de
						navegar, o checkout é rápido e temos o melhor serviço de atendimento ao consumidor, além de
						processo de troca super fácil!
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Enviamos para todo o Brasil e, para facilitar ainda mais, oferecemos frete grátis nas compras
						acima de R$149,99 para a região Sudeste e acima de R$349,99 para as demais regiões do território
						nacional.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						O seu look fitness para malhar com todo o estilo está aqui na nossa loja: leggings, shorts, bermudas,
						body, blusas, camisetas, vestidos, calçados e acessórios!
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Além disso, você aproveita em nossa loja as últimas tendências em roupa íntima tais como
						calcinhas, sutiãs, bodies, conjuntos e sleepwear para você se curtir em todos os momentos.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Aqui na nossa loja você também encontra seu biquíni perfeito. São peças vendidas separadamente
						para você escolher o tamanho, modelo ou estampa que você quiser e montar seu conjunto de biquíni
						do seu jeito!
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Seja roupa de ginástica, roupa íntima, roupa de dormir, calçados ou biquínis e maiôs, o seu look
						está na nossa loja!
					</Text>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
