import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'

export default function PaymentMethods(props) {
	const PAGE = 'Formas de pagamento'

	return (
		<Page title={PAGE}>
			<HeaderTemplate
				headerType={'ReturnAndText'}
				contentText={'Formas de pagamento'}
			/>

			<View className='p-4 flex flex-col gap-4 w-full'>
				<Accordion
					name='payment-accordion-1'
					className='collapse-arrow'>
					<Accordion.Title className='text-sm uppercase'>
						Quais as formas de pagamento no site?
					</Accordion.Title>
					<Accordion.Content>
						<Text className='pt-4'>
							Nossa forma de pagamento é por pix tradicional, pix parcelado em 4 vezes, boleto bancário e
							cartão de crédito. Aceitamos as seguintes bandeiras: Mastercard, Visa, American Express, Elo
							e Hypercard. Parcelamos em até 10x sem juros, com parcela mínima de R$ 50,00.
						</Text>

						<Text className='mt-4 font-bold'>PIX</Text>
						<Text>
							Estornos em forma de pagamento pix, são feitos em até 10 dias úteis após passar pela
							conferência e aprovação do nosso setor de qualidade. Dentro desse período caso ainda esteja
							em aberto alguma das parcelas, é necessário que o pagamento seja efetivado, uma vez que o
							estorno ocorrerá no valor da solicitação enviada e confirmada. O não pagamento da parcela
							acarretará na cobrança de uma taxa de conveniência no valor de R$ 10,00 por parcela.
						</Text>

						<Text className='mt-4 font-bold'>BOLETO BANCÁRIO</Text>
						<Text>
							O boleto bancário será gerado na finalização do pedido, com prazo de um dia útil, podendo
							ser pago em qualquer banco até o vencimento; Se o boleto foi emitido durante o final de
							semana o vencimento será no próximo dia útil. Caso o boleto não seja pago até a data do
							vencimento, o pedido será automaticamente cancelado.
						</Text>

						<Text className='mt-4 font-bold'>EM CASO DE TROCAS E DEVOLUÇÕES DE COMPRAS COM BOLETO</Text>
						<Text>
							É necessário o preenchimento de todos os campos do formulário Troca e Devoluções e após o
							recebimento do produto, a loja tem até 10 dias uteis para gerar o crédito na loja virtual ou
							o estorno em conta. Lembrando que os pagamentos, para serem efetuados na conta bancária de
							terceiros, será necessário que seja descriminado no ato da solicitação de reembolso, caso
							contrário não serão efetivados. Em caso de estorno, o mesmo deverá ser realizado em conta do
							mesmo CPF da compra.
						</Text>
					</Accordion.Content>
				</Accordion>

				<Accordion
					name='payment-accordion-2'
					className='collapse-arrow'>
					<Accordion.Title className='text-sm uppercase p-0 min-h-0 font-normal'>
						É possível passar a mesma compra em cartões diferentes?
					</Accordion.Title>
					<Accordion.Content className='p-0'>
						<Text className='pt-4'>Sim, você pode dividir a sua compra em mais de um cartão.</Text>
					</Accordion.Content>
				</Accordion>
			</View>
		</Page>
	)
}
