import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'

export default function ExchangesReturns() {
	const PAGE = 'Política de Devolução'

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
					<Text className='text-lg font-bold uppercase'>POLÍTICA DE DEVOLUÇÕES:</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A sua satisfação é muito importante para nós! E para garantir uma excelente experiência de
						compra conosco, reunimos informações muito importantes. Sempre que quiser devolver um produto,
						fica atenta se sua peça está respeitando as regrinhas abaixo:
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Você tem o prazo de até 7 dias corridos a contar da data do recebimento do seu pedido, para
						realizar a devolução dos produtos que adquiriu.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Importante! O produto a ser devolvido precisa estar relacionado neste pedido.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Você terá a opção de devolver o pedido parcial, clicando apenas nos produtos específicos ou em
						todos, mas é preciso justificar o motivo para que a devolução seja concluída.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						O produto deve estar sem sinais de uso, lavagem e sem odores, em perfeitas condições e com a
						etiqueta interna afixada. Produtos que tenham sido alterados não podem ser devolvidos.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Produto com Bojo deve ser enviado em caixa, para que não sejam danificados.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Para a devolução de conjunto, as duas peças devem ser enviadas juntas.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Para devolução de kits, todas as peças devem ser devolvidas.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Para os produtos que apresentarem defeito de fabricação, você terá o prazo de até 90 dias para
						realizar a devolução. Vamos pedir que nos envie três fotos ao abrir esta solicitação e caso não
						fique claro o defeito, podemos solicitar que nos envie o produto para avaliação.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						No caso de produtos devolvidos sem prévia comunicação ou que não esteja de acordo com as regras
						acima, a peça ficará retida na empresa no prazo de 30 dias para pagamento do frete de retorno ao
						cliente.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Após o prazo de 30 dias, não nos responsabilizaremos pela guarda do produto e será descartada. O
						mesmo vale para devoluções reprovadas após a análise dos produtos pelo nosso departamento de
						qualidade.
					</Text>
				</View>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>DEVOLUÇÃO</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Após o envio da sua devolução via Correios, será necessário aguardar o recebimento dos produtos
						em nosso Centro de Distribuição, para análise dos itens recebidos. Essa etapa ocorrerá em até 5
						dias úteis, variando de acordo com o nosso fluxo de devoluções, e após ela, te comunicaremos os
						próximos passos via e-mail.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Se não receber o e-mail com as instruções em até 24 horas úteis, entre em contato com nosso
						atendimento.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Estando dentro das regras para devolução, disponibilizamos seu crédito acrescido do bônus
						relativo ao frete proporcional das peças devolvidas.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Se porventura a soma dos valores de sua devolução for maior que o custo do frete para o seu
						endereço, sua devolução será creditada em sua conta sem o acréscimo do valor do frete.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Caso você não tenha interesse em utilizar esse crédito, entre em contato conosco e solicite o
						seu reembolso. Lembre-se que as opções de reembolso são limitadas à forma de pagamento original
						do seu pedido.
					</Text>
				</View>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>
						Posso trocar uma peça por outra de tamanho, cor ou modelo diferente?
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A loja trabalha com a devolução. Você devolve o produto e nós disponibilizamos um crédito
						equivalente ao valor da(s) peça(s) devolvida(s) para que seja utilizado em nosso site da maneira
						que preferir, tanto para adquirir a mesma peça em cor/tamanho diferente, quanto para novos
						ítens.
					</Text>
				</View>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Reembolso</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A loja disponibiliza apenas um frete gratuito por pedido para o processo de devolução,
						conforme previsto em nossa política. Em casos de novos envios relacionados ao mesmo pedido, os
						custos de transporte ficam sob responsabilidade do cliente.
					</Text>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
