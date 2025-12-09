import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'
import { openBrowser } from '../services/NavigationService'

export default function DeliveryPolicy() {
	const PAGE = 'Política de Entrega'

	const goToDelivery = () => {
		openBrowser('DeliveryPolicy', 'https://rastreamento.correios.com.br/app/index.php', true)
	}

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
					<Text className='text-lg font-bold uppercase'>Como acompanhar a entrega do meu pedido?</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Você localiza o status da sua compra acessando seu cadastro e clicando em MEUS PEDIDOS. Lá, você
						encontra todas as informações de cada compra já realizada, dentre elas o código de rastreamento.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Não se esqueça que a validação deste código ocorre em até 72hs úteis após o envio do pedido.
						Caso ainda não consiga rastreá-lo, certifique-se de que esse prazo já foi concluído. Para mais
						informações, entre em contato conosco pela Central de Atendimento.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>
						Recebi meu código de rastreio, mas ele não está ativo no site dos correios.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Após a emissão do código de rastreio pelo nosso sistema, pedimos um prazo de até 72hs úteis para
						efetiva ativação. Após esse prazo você poderá acompanhar seu pedido pelo próprio site dos
						correios clicando
					</Text>
					<View onClick={goToDelivery}>
						<Text className='text-sm leading-relaxed text-justify underline font-bold'>
							Rastrear pedido
						</Text>
					</View>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>
						Prazo para recebimento do pedido em meu endereço.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Antes do envio do pedido, seu pacote passa por alguns processos, portanto fique atento aos
						prazos e procedimentos de cada etapa.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Após a confirmação de pagamento, solicitamos o prazo de 3 a 5 dias úteis para montagem e envio
						do seu pedido.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Os prazos de entrega são calculados de acordo com sua região, variando também se sua escolha for
						PAC ou SEDEX. As informações são expostas no ato da compra ou simulação do frete.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Vale lembrar que os prazos de entrega começam a contar a partir da ativação do código de
						rastreamento.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Meu pedido retornou a loja.</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Normalmente as devoluções de pedidos estão relacionadas aos seguintes pontos:
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						- Endereço cadastrado incorretamente no site.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						- Pedido recusado no endereço cadastrado.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>- Mudança de residência.</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						- Carteiro não atendido. Lembrando que, nesse caso, a logística de entrega dos correios efetua
						aproximadamente até 3 tentativas de entrega.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						- Pedido foi disponibilizado para retirada em agência por logística dos correios e não foi
						retirado em tempo hábil.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Em situações em que o pacote retorna para loja devido a falha na entrega, o pedido será desfeito
						e o valor pago será disponibilizado em créditos no cadastro do cliente, para que ele possa
						realizar uma nova compra.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Se preferir, você pode solicitar o reembolso entrando em contato conosco através da nossa
						Central de Atendimento. Lembre-se de que as opções de reembolso estão limitadas à forma de
						pagamento original do seu pedido.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Recebi a minha encomenda violada.</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A recomendação nesse caso é a recusa do pacote no ato da entrega, pois caso a encomenda seja
						recebida, você se responsabiliza por ela, necessitando assim do contato direto com os Correios.
						A loja se isenta de responsabilidades após o recebimento de um pedido violado.
					</Text>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
