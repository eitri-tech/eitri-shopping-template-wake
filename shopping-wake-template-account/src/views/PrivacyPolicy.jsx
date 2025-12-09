import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'
import { navigate, PAGES } from '../services/NavigationService'
import { detailsPolicy } from '../utils/privacyPolicy'

export default function PrivacyPolicy() {
	const PAGE = 'Política de privacidade'

	const goToContact = () => {
		navigate(PAGES.CONTACT)
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
					<Text className='text-lg font-bold uppercase'>Políticas de Privacidade</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A LSM Comércio Eletrônico de Roupas e Acessórios EIRELI (loja), respeita e preserva as
						informações de seus usuários. Por isso, desenvolvemos esta Política de Privacidade para que você
						esteja ciente das informações e dados que coletamos e de que forma são utilizados. Todos os
						dados armazenados são tratados com absoluto sigilo e segurança.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Ao visitar e usufruir do nosso site, você aceita automaticamente as condições descritas a
						seguir, que compõem nossa Política de Privacidade.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>INFORMAÇÕES COLETADAS E TRATATIVA DE DADOS</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Nosso site coleta informações tais como: nome, endereço físico, endereço de e-mail, CPF/ CNPJ,
						telefone de contato, data de nascimento e cartão de crédito para processar e completar seu
						pedido.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						O número do seu cartão de crédito é usado somente no processamento de compra e compartilhado
						somente com a intermediadora financeira, conforme os termos da lei. Ele não é, de forma alguma,
						guardado em nossos arquivos depois da operação.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Dados como telefone, e-mail e nome podem ser armazenados mesmo após você ter efetuado a compra
						com o objetivo de enviar mensagens relativas ao seu pedido, divulgações de promoções e
						lançamentos em nosso site, seja por e-mail, telefone, WhatsApp, redes sociais, notificações de
						Push ou outro meio de comunicação disponível. Também mantemos registro de suas compras e
						produtos que visualizou. Quaisquer outros dados cadastrais que nos permitam melhorar sua
						experiência como cliente são armazenados com finalidades estatísticas para que possamos melhorar
						nosso site, produtos e serviços exclusivos que oferecemos ou podemos vir a oferecer.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						O conteúdo coletado pode ser utilizado para monitorar tendências de uso de nossos clientes,
						picos do servidor, padrões de navegação, números de acesso para que possamos compreender onde
						estão nossos clientes e como interagem conosco.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Nosso site poderá utilizar web beacons, pixel tags, entre outras tecnologias de rastreamento,
						sem que o usuário seja identificado de forma individual.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Utilizamos também o uso de cookies para reconhecer um visitante constante e melhorar sua
						experiência de navegação e compra. Os cookies são pequenos arquivos de dados transferidos de um
						site da web para o disco do computador e não armazenam dados pessoais. Durante todo este
						processo, tratamos as informações com sigilo descrito nesta Política, ressaltando que estes
						dados são coletados de forma automatizada.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						As informações do cliente coletadas pelo site no momento da compra de produtos poderão ser
						compartilhadas com empresas parceiras por questões de logística e para viabilizar a entrega das
						mercadorias.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Caso prefira, você pode utilizar o navegador anônimo para que suas ações não sejam identificadas
						por cookies ou beacons.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>USO DE IMAGEM</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Os conteúdos digitias que você posta nas redes sociais marcando nosso perfil podem vir a ser
						utilizadas em nossos canais oficiais - sendo eles Facebook, Instagram, Tiktok e Linkedin.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Temos como premissa, entrar em contato com o cliente confirmando a autorização de uso.
						Entretanto, este termo já nos concede o uso nos canais especificados acima.
					</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>MODIFICAÇÕES NAS POLÍTICAS DA EMPRESA</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						A loja pode, a qualquer momento, rever os termos das políticas da empresa com a finalidade de
						atender melhor seus clientes. Por isso, verifique este documento com frequência para estar
						sempre informado e atualizado quanto à nossa Política de Privacidade.
					</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						As informações armazenadas em nosso site nos ajudam a compreender melhor os interesses de nossos
						clientes para a melhoria contínua dos produtos e de como os disponibilizamos para você.
					</Text>
					<View
						className='m-0 p-0'
						onClick={goToContact}>
						<Text className='text-sm leading-relaxed text-justify'>
							Para perguntas ou sugestões, entre em contato com a gente por meio dos nossos canais de
							relacionamento com o cliente clicando aqui.
						</Text>
					</View>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
