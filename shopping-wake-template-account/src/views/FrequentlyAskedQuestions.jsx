import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'
import { navigate } from '../services/NavigationService'

export default function FrequentlyAskedQuestions() {
	const PAGE = 'Perguntas frequentes'

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

			<View className='flex flex-col p-4 gap-4 mb-4'>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Meu Cadastro</Text>

					<View className='flex flex-col gap-1'>
						<Text className='text-sm font-bold text-justify'>Como se cadastrar no site?</Text>
						<View onClick={() => navigate(PAGES.LOGIN)}>
							<Text className='text-sm leading-relaxed text-justify'>
								Para se cadastrar no App clique aqui.
							</Text>
						</View>
					</View>

					<View className='flex flex-col gap-1'>
						<Text className='text-sm font-bold text-justify'>É seguro comprar no site da loja?</Text>
						<Text className='text-sm leading-relaxed text-justify'>
							Sim. Todas as informações de nossos clientes são criptografadas, nunca, nenhum membro da
							equipe loja terá acesso a qualquer dado de cartão de crédito entre outras informações
							confidenciais.
						</Text>
					</View>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>FORMAS DE PAGAMENTO</Text>

					<Text className='text-sm font-bold text-justify'>Quais são as formas de pagamento no site?</Text>

					<View className='flex flex-col gap-1'>
						<Text className='text-sm font-bold text-justify'>Cartão de crédito</Text>
						<Text className='text-sm leading-relaxed text-justify'>
							Em até 6x sem juros, ou 12x com juros.
						</Text>
					</View>

					<View className='flex flex-col gap-1'>
						<Text className='text-sm font-bold text-justify'>PIX ou Boleto Bancário</Text>
						<Text className='text-sm leading-relaxed text-justify'>Com desconto de 10%.</Text>
					</View>

					<View className='flex flex-col gap-1'>
						<Text className='text-sm font-bold text-justify'>Conta corrente</Text>
						<Text className='text-sm leading-relaxed text-justify'>
							Para pedidos finalizados via boleto ou PIX, oferecemos um desconto exclusivo de 10% sobre os
							valores efetivamente pagos. Este é um benefício especial para nossos clientes que optam por
							essas formas de pagamento. Caso você possua créditos provenientes de devoluções ou pedidos
							anteriores, esses valores serão utilizados como forma de pagamento primária, não sendo
							aplicado o desconto de 10% em suas novas compras. O desconto de 10% será aplicado ao saldo
							restante efetivamente pago, utilizando boleto ou PIX como forma de pagamento secundária.
							Além disso, você também tem a opção de solicitar o reembolso dos valores diretamente em sua
							conta corrente. Assim, poderá utilizar esses valores para novas compras e ainda aproveitar o
							desconto oferecido. Lembre-se que as opções de reembolso são limitadas à forma de pagamento
							original do seu pedido.
						</Text>
					</View>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>COMO ENCONTRAR O MEU TAMANHO?</Text>

					<Text className='text-sm leading-relaxed text-justify'>
						Na página de qualquer produto, você encontra nossa tabela de medidas logo acima do botão de
						“adicionar à bolsa”. Além disso, você também pode consultar qual seu tamanho ideal na loja usando
						nosso provador virtual! Basta clicar em “encontre seu tamanho”, opção localizada ao lado da
						tabela de medidas, inserir suas medidas e escolher o tamanho mais adequado ao seu corpo.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>PRAZO PARA APROVAÇÃO DO MEU PEDIDO</Text>

					<Text className='text-sm font-bold text-justify'>Aprovação de pagamento via Cartão de Crédito</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Se seu pedido foi pago com cartão de crédito, ele pode ser aprovado em até 48 horas úteis. Esse
						prazo pode ser necessário para a análise das operadoras de cartão e intermediadoras financeiras,
						e independe de saldos e limites disponíveis. Durante esse período são verificadas informações
						pessoais e de cadastro, com o objetivo de trazer mais segurança às suas compras.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Fique atenta ao seu telefone! Algumas operadoras e intermediadoras fazem ligações telefônicas
						aos seus clientes para confirmação de dados, como política de segurança.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Lembramos que tanto os prazos quanto a operação de conferência de dados não são controlados pela
						loja.
					</Text>

					<Text className='text-sm font-bold text-justify'>Aprovação de pagamento via Boleto Bancário</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Os boletos são gerados com vencimento para 5 dias após a conclusão de sua compra. Eles podem ser
						pagos em toda rede bancária e através do aplicativo do seu banco via celular ou via sistemas de
						internet banking.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Lembre-se que após o efetivo pagamento, a rede bancária pode levar até 48 horas úteis para
						comunicar a aprovação de seu pedido. Somente após esse prazo, seu pedido será considerado pago e
						seguirá para processamento.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Fique atento à data de vencimento de seu boleto. Após a data limite do vencimento, a loja não
						garante a reserva de seu pedido e dos itens nele presentes. Todo pedido realizado via boleto é
						desfeito após a data limite de vencimento do boleto gerado originalmente.
					</Text>

					<Text className='text-sm font-bold text-justify'>Aprovação de pagamento via PIX</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A chave PIX fica disponível por até 3h, após este período, a compra é cancelada. O tempo de
						compensação dos pedidos pagos via PIX é de, em média, 10 segundos. Este tempo pode se estender
						até 60 minutos para a validação, de acordo com as políticas de segurança do seu banco.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						O método de pagamento é válido também para finais de semana e feriados, seja qual for o horário
						da transação. É importante que se certifique de possíveis restrições de horário e valores
						configuradas em sua conta, de acordo com resolução vigente do Banco Central.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>COMO LOCALIZAR O MEU BOLETO?</Text>

					<Text className='text-sm leading-relaxed text-justify'>
						O boleto é encaminhado para o e-mail de cadastro após a finalização da compra e o prazo de
						vencimento é de 5 dias corridos.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Verifique sua caixa de spam ou lixo eletrônico e confirme se seu e-mail de cadastro é o mesmo
						que você usa atualmente.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Não encontrou? Fique tranquila! Você pode imprimi-lo novamente acessando o pedido em questão na
						página MEUS PEDIDOS, e clicando na opção “imprimir boleto”, localizada abaixo das informações de
						pagamento.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Fique atento à data de vencimento de seu boleto. Após a data limite do vencimento a loja não
						garante a reserva de seu pedido e dos itens nele presentes. Todo pedido realizado via boleto é
						desfeito após a data limite de vencimento do boleto gerado originalmente.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>PREPARO DO PEDIDO</Text>

					<Text className='text-sm font-bold text-justify'>Preparo de pedido</Text>

					<Text className='text-sm leading-relaxed text-justify'>
						Após a confirmação de pagamento, os pedidos entram em processo de separação e montagem e podem
						levar de 3 a 5 dias úteis para serem despachados. Caso o seu código de rastreio já esteja
						disponível em seu cadastro é sinal que está em processo de embarque. Após o status enviado,
						solicitamos o prazo de até 72 horas úteis para ativação do código de rastreio junto aos
						Correios.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>RETIRADA DO PEDIDO EM AGÊNCIAS DOS CORREIOS</Text>

					<Text className='text-sm leading-relaxed text-justify'>
						Para evitar transtornos, verifique se o endereço fornecido tem cobertura dos Correios ou se há
						necessidade de retirada na agência.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Para retirar na agência, basta apresentar um documento de identificação e o código do objeto.
						Mas lembre-se: caso seja um terceiro a retirar sua encomenda, será necessário apresentar um
						documento de identificação pessoal de quem realizou o pedido, junto a uma carta escrita de
						próprio punho com a autorização formal e o código de rastreio do pacote.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Fique atento ao prazo de retirada para evitar que sua encomenda retorne.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>ALTERAÇÕES DE PEDIDOS APÓS SUA FINALIZAÇÃO.</Text>

					<Text className='text-sm leading-relaxed text-justify'>
						Para a sua segurança, não é possível realizar alterações após o pedido ter sido finalizado.
						Nossa equipe não tem acesso a alterações de endereço, formas de envio, quantidade de peças,
						cores, tamanhos ou forma de pagamento.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Em caso de pedidos finalizados por boleto ou PIX e o pagamento não tenha sido concluído, basta
						desconsiderar e realizar uma nova compra em nosso site.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Após o recebimento, você pode solicitar a devolução integral ou parcial do pedido, sem custos,
						dentro do prazo de 7 dias corridos a contar da data do recebimento.
					</Text>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
