import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'
import { View, Text } from 'eitri-luminus'

export default function Delivery(props) {
	const PAGE = 'Entrega'
	const [expressDeliveryHeight, setExpressDeliveryHeight] = useState(0)
	const [deliveryOptionsHeight, setDeliveryOptionsHeight] = useState(0)
	const [addressChangeHeight, setAddressChangeHeight] = useState(0)
	const [deliveryTimeHeight, setDeliveryTimeHeight] = useState(0)
	const [shippingCostHeight, setShippingCostHeight] = useState(0)
	const [nationalDeliveryHeight, setNationalDeliveryHeight] = useState(0)

	const onClick = value => {
		switch (value) {
			case 'express':
				setExpressDeliveryHeight(expressDeliveryHeight !== 0 ? 0 : 'auto')
				break
			case 'options':
				setDeliveryOptionsHeight(deliveryOptionsHeight !== 0 ? 0 : 'auto')
				break
			case 'address':
				setAddressChangeHeight(addressChangeHeight !== 0 ? 0 : 'auto')
				break
			case 'time':
				setDeliveryTimeHeight(deliveryTimeHeight !== 0 ? 0 : 'auto')
				break
			case 'cost':
				setShippingCostHeight(shippingCostHeight !== 0 ? 0 : 'auto')
				break
			case 'national':
				setNationalDeliveryHeight(nationalDeliveryHeight !== 0 ? 0 : 'auto')
				break
		}
	}

	return (
		<Page title={PAGE}>
			<HeaderTemplate
				headerType={'ReturnAndText'}
				contentText={'Entrega'}
			/>

			<View
				padding='large'
				direction='column'
				gap={16}
				width='100%'
				marginBottom='display'>
				<View>
					<View
						onClick={() => onClick('express')}
						width='100%'>
						<Text
							fontSize='small'
							textTransform='uppercase'>{`ENTREGA EXPRESS ${
							expressDeliveryHeight === 0 ? '+' : '-'
						}`}</Text>
					</View>
					<View
						direction='column'
						gap={12}
						height={expressDeliveryHeight}
						overflow='hidden'>
						<Text paddingTop='large'>
							Ação válida para cidade de São Paulo e grande São Paulo* Nossas entregas são de 9h até as
							21h de cada dia útil.
						</Text>
						<Text>
							A opção de ENTREGA EXPRESS – no mesmo dia, será apresentada após preenchimento do endereço
							de entrega. Caso o CEP faça parte da região do serviço, a opção de entrega será oferecida,
							caso o cep da sua região não seja elegível o site não apresentará essa opção.
						</Text>
						<Text>
							Compras com pagamento aprovado até as 14h serão entregues até as 21h, compras com pagamento
							aprovado após as 14h01 serão entregues no próximo dia útil até as 21h.
						</Text>
						<Text>O prazo para entrega é válido após a confirmação de pagamento.</Text>
						<Text>Pedidos realizados aos Sábados e Domingos serão entregues no próximo dia útil.</Text>
						<Text>
							A opção de entrega express – no mesmo dia, é um serviço de entregas express válida apenas
							para venda de produtos. Serviços como troca, devoluções ou similares, devem seguir o
							processo indicado no site; www.email.com.br
						</Text>
						<Text>
							Todas as entregas respeitam as normas de distanciamento da OMS, com uso obrigatório de
							luvas, máscaras e álcool em gel.
						</Text>
						<Text>
							Insucessos de entrega ocasionados por ausência do cliente no endereço da entrega, entrarão
							no fluxo de entregas normal pelos correios, no próximo dia útil.
						</Text>
						<Text
							fontWeight='bold'
							marginTop='large'>
							CONDIÇÕES QUE INVALIDAM A ENTREGA NO PRAZO
						</Text>
						<Text>
							Insucessos de entrega ocasionados por ausência do cliente no endereço da entrega, dados
							cadastrais incorretos, recusa do produto pelo cliente e mudança de endereço.
						</Text>
						<Text>*confira os CEPs participantes.</Text>
						<Text>*Produtos comprados aos finais de semana, será entregue no próximo dia útil</Text>
					</View>
				</View>

				<View>
					<View
						onClick={() => onClick('options')}
						width='100%'>
						<Text
							fontSize='small'
							textTransform='uppercase'>{`Quais são as opções de entrega? ${
							deliveryOptionsHeight === 0 ? '+' : '-'
						}`}</Text>
					</View>
					<View
						direction='column'
						gap={12}
						height={deliveryOptionsHeight}
						overflow='hidden'>
						<Text paddingTop='large'>
							Temos três modalidades de entrega e todas são seguras e eficazes: PAC (via Correios), Sedex
							e Entrega Express via transportadora.
						</Text>

						<Text
							fontWeight='bold'
							marginTop='large'>
							ENTREGA EXPRESS - NO MESMO DIA
						</Text>
						<Text>
							A entrega express – no mesmo dia, são oferecidas somente para grande São Paulo e tem o valor
							fixo de R$ 45,00.
						</Text>
						<Text>
							Para sua compra ser entregue no mesmo dia, a compra deverá ser realizada até as 14h e em dia
							útil. Se o pedido ou aprovação do pagamento acontecer após às 14h01, o mesmo será entregue
							até às 14h do próximo dia útil. Pedidos aprovados aos finais de semana, serão entregues no
							próximo dia útil, até às 18h.
						</Text>
						<Text>
							Nossas entregas são de 8h ate as 21h de cada dia útil. A opção de entrega express – no mesmo
							dia, será apresentada após preenchimento do endereço de entrega. Caso o CEP faça parte da
							região do serviço, a opção de entrega será oferecida.
						</Text>
						<Text>
							A opção de entrega express – no mesmo dia, é um serviço de entregas express válida apenas
							para venda de produtos. Serviços como troca, devoluções ou similares, devem seguir o
							processo indicado no site; www.loja.com.br.
						</Text>
						<Text>
							Todas as entregas respeitam as normas de distanciamento da OMS, com uso obrigatório de
							luvas, máscaras e álcool em gel.
						</Text>
						<Text>
							Insucessos de entrega ocasionados por ausência do cliente no endereço da entrega, entrarão
							no fluxo de entregas normal pelos correios, no próximo dia útil.
						</Text>
						<Text
							fontWeight='bold'
							marginTop='large'>
							CONDIÇÕES QUE INVALIDAM A ENTREGA NO PRAZO
						</Text>
						<Text>
							Insucessos de entrega ocasionados por ausência do cliente no endereço da entrega, dados
							cadastrais incorretos, recusa do produto pelo cliente e mudança de endereço
						</Text>
					</View>
				</View>

				<View>
					<View
						onClick={() => onClick('address')}
						width='100%'>
						<Text
							fontSize='small'
							textTransform='uppercase'>{`Posso alterar o endereço de entrega? ${
							addressChangeHeight === 0 ? '+' : '-'
						}`}</Text>
					</View>
					<View
						direction='column'
						gap={12}
						height={addressChangeHeight}
						overflow='hidden'>
						<Text paddingTop='large'>
							Não é possível alterar. Uma vez o pedido finalizado não conseguimos fazer nenhum tipo de
							alteração, agora para compras futuras, no seu cadastro, você pode editar o endereço caso
							tenha alguma informação incorreta.
						</Text>
					</View>
				</View>

				<View>
					<View
						onClick={() => onClick('time')}
						width='100%'>
						<Text
							fontSize='small'
							textTransform='uppercase'>{`Qual o prazo de entrega? ${
							deliveryTimeHeight === 0 ? '+' : '-'
						}`}</Text>
					</View>
					<View
						direction='column'
						gap={12}
						height={deliveryTimeHeight}
						overflow='hidden'>
						<Text paddingTop='large'>
							O prazo de entrega varia de acordo com cada região e é informado na hora da compra ao
							inserir seu cep
						</Text>
					</View>
				</View>

				<View>
					<View
						onClick={() => onClick('cost')}
						width='100%'>
						<Text
							fontSize='small'
							textTransform='uppercase'>{`Qual o valor do frete? ${
							shippingCostHeight === 0 ? '+' : '-'
						}`}</Text>
					</View>
					<View
						direction='column'
						gap={12}
						height={shippingCostHeight}
						overflow='hidden'>
						<Text paddingTop='large'>
							Não temos frete fixo e ele pode variar dependendo da quantidade e peso das peças.
						</Text>
					</View>
				</View>

				<View>
					<View
						onClick={() => onClick('national')}
						width='100%'>
						<Text
							fontSize='small'
							textTransform='uppercase'>{`A nossa loja entrega em todo o Brasil? ${
							nationalDeliveryHeight === 0 ? '+' : '-'
						}`}</Text>
					</View>
					<View
						direction='column'
						gap={12}
						height={nationalDeliveryHeight}
						overflow='hidden'>
						<Text paddingTop='large'>Sim! Entregamos para todo o Brasil.</Text>
					</View>
				</View>
			</View>
		</Page>
	)
}
