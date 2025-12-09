import { LoadingComponent } from 'shopping-wake-template-shared'
import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'

export default function WorkWithUs(props) {
	const PAGE = 'Trabalhe conosco'
	const [isLoading, setIsLoading] = useState(true)

	const [user, setUser] = useState({})

	const setField = (field, value) => {
		setUser({ ...user, [field]: value, [`${field}ErrorMsg`]: '' })
	}

	useEffect(() => {
		setIsLoading(false)
	}, [])

	//arrumar quando descobrir para onde levar o formulario
	const falseReload = () => {
		setIsLoading(true)
		setTimeout(() => {
			setUser({})
			setIsLoading(false)
		}, 500)
	}

	return (
		<Page title={PAGE}>
			<HeaderTemplate
				headerType={'ReturnAndText'}
				contentText={'Trabalhe conosco'}
			/>

			<LoadingComponent
				isLoading={isLoading}
				fullScreen
			/>

			<View
				direction='column'
				gap={16}
				width='100%'>
				<View
					minWidth='300px'
					height='312px'
					backgroundImage={
						'https://loja.fbitsstatic.net/img/b/a81f2c26-e169-4ea1-af28-1e88850147d4.png?w=564&h=449'
					}
					backgroundRepeat='no-repeat'
					backgroundSize='cover'
					backgroundPositionX='center'
					direction='row'
					justifyContent='center'
					alignItems='center'>
					<View
						direction='row'
						gap={12}>
						<Text
							color='secondary-100'
							fontSize='big'>{`T R A B A L H E`}</Text>
						<Text
							color='secondary-100'
							fontSize='big'>{`C O N O S C O`}</Text>
					</View>
				</View>

				<View
					padding='large'
					direction='column'
					width='100%'>
					<View
						direction='row'
						justifyContent='center'
						alignItems='center'
						marginBottom='large'>
						<Text
							textAling='center'
							textTransform='uppercase'
							fontSize='extra-large'>
							Junte se a nossa equipe
						</Text>
					</View>

					<View direction='column'>
						<View direction='column'>
							<Text marginTop='large'>NOME</Text>
							<CustomInput
								placeHolder='NOME'
								id='frm_name'
								placeHolde
								height={'34px'}
								value={user.name}
								onChange={value => setField('name', value)}
								type='text'
								inputMode='text'
								nextInputOnSubmit={'frm_email'}
							/>
						</View>

						<View direction='column'>
							<Text marginTop='large'>E-MAIL</Text>
							<CustomInput
								placeHolder='E-MAIL'
								id='frm_email'
								placeHolde
								height={'34px'}
								value={user.email}
								onChange={value => setField('email', value)}
								type='email'
								inputMode='email'
								nextInputOnSubmit={'frm_number'}
							/>
						</View>

						<View
							direction='row'
							gap={12}>
							<View direction='column'>
								<Text marginTop='large'>TELEFONE</Text>
								<CustomInput
									placeHolder='TELEFONE'
									id='frm_number'
									height={'34px'}
									mask='(99) 99999-9999'
									value={user.primaryPhoneNumber || ''}
									onChange={value => setField('primaryPhoneNumber', value)}
									type='number'
									inputMode='numeric'
									nextInputOnSubmit='frm_cep'
								/>
							</View>

							<View
								direction='column'
								marginBottom='large'>
								<Text marginTop='large'>CEP</Text>
								<CustomInput
									id='frm_cep'
									height={'34px'}
									mask='99999-999'
									value={user.cep || ''}
									onChange={value => setField('cep', value)}
									type='number'
									inputMode='numeric'
									nextInputOnSubmit='frm_message'
								/>
							</View>
						</View>

						<View
							height='136px'
							marginBottom='large'>
							<Textarea
								id='frm_message'
								placeholder='Digite aqui sua mensagem'
								value={user.message}
								onChange={value => setField('message', value)}
								backgroundColor='secondary-300'
								fontSize='medium'
								color='neutral-500'
								borderHidden={true}
								height='100%'
								borderRadius='none'
							/>
						</View>

						<View>
							<View
								width='190px'
								onClick={() => falseReload()}
								height='50px'
								direction='row'
								justifyContent='center'
								alignItems='center'
								borderWidth='hairline'>
								<Text fontSize='small'>{`C A D A S T R A R`}</Text>
							</View>
						</View>
					</View>
				</View>

				<View
					direction='column'
					marginVertical='large'>
					<View
						paddingHorizontal='large'
						marginVertical='giant'
						direction='column'
						gap={38}>
						<Image src='https://loja.fbitsstatic.net/img/b/b59e7776-46d0-4454-8269-ec9a6c3ae95e.jpg' />
						<View
							width='100%'
							direction='column'
							gap={16}>
							<Text
								textAlign='center'
								width='100%'
								fontSize='extra-small'
								color='neutral-700'
								fontWeight='light'>{`N A S C I M E N T O`}</Text>
							<Text
								textAlign='center'
								width='100%'
								fontSize='big'
								color='neutral-700'
								fontWeight='regular'
								textTransform='uppercase'>{`loja`}</Text>
						</View>

						<View
							direction='column'
							gap={24}>
							<Text
								color='neutral-900'
								fontWeight='regular'>
								Em 1986, um visionário chamado Luiz Vaiano iniciou uma jornada que transcenderia os
								limites da moda, transformando-se na história da loja. Originada nas raízes de
								uma paixão pela indústria têxtil e pelo varejo nacional, nossa marca nasceu da visão e
								do comprometimento de um homem que sempre soube que podia ir além.
							</Text>
						</View>
					</View>

					<View
						paddingHorizontal='large'
						marginVertical='giant'
						direction='column'
						gap={38}>
						<Image src='https://loja.fbitsstatic.net/img/b/332e5bbe-a280-4f44-8136-e72ea9d0f5cf.jpg' />
						<View
							width='100%'
							direction='column'
							gap={16}>
							<Text
								textAlign='center'
								width='100%'
								fontSize='extra-small'
								color='neutral-700'
								fontWeight='light'>{`N A S C I M E N T O`}</Text>
							<Text
								textAlign='center'
								width='100%'
								fontSize='big'
								color='neutral-700'
								fontWeight='regular'
								textTransform='uppercase'>{`loja`}</Text>
						</View>

						<View
							direction='column'
							gap={24}>
							<Text
								color='neutral-900'
								fontWeight='regular'>
								Somos apaixonados por pessoas. Vivemos em equipe e acreditamos que um ambiente feliz,
								traz resultados. Trabalhamos duro e somos leves na essência.
							</Text>
							<Text
								color='neutral-900'
								fontSize='small'
								fontWeight='bold'
								textTransform='uppercase'>
								Este é o lugar para quem deseja se tornar a melhor versão de si mesmo. Venha construir
								essa história com a gente!
							</Text>
						</View>
					</View>
				</View>
			</View>
		</Page>
	)
}
