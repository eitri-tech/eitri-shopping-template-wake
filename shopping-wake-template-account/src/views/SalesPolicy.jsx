import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'

export default function SalesPolicy() {
	const PAGE = 'Política de Venda'

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
					<Text className='text-lg font-bold uppercase'>Venda Simultânea</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A empresa se reserva o direito de proceder o cancelamento da venda no caso de vendas simultâneas
						de produtos que gere a baixa de estoque.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Em tal caso, o crédito será disponibilizado imediatamente no cadastro do cliente na plataforma
						para novas compras, sendo o cliente comunicado do fato para que forneça os dados bancários, para
						opção de reembolso ou estorno da transação bancária.
					</Text>
				</View>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>
						Pedidos retidos na Secretaria de Fazenda (SEFAZ)
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A loja não se responsabiliza pela retenção de mercadorias na Sefaz quando esta se deve
						exclusivamente à pendência do cliente. A eventual lavratura de auto de infração lavrada pelo
						fisco, em face do cliente, exige o seu comparecimento no posto fiscal para a liberação da
						mercadoria ou mesmo para impugnar o eventual auto de infração, tendo em vista que nestes casos
						as informações referentes à liberação e pagamentos só são passadas ao contribuinte do imposto
						responsáveis.
					</Text>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
