import Eitri from 'eitri-bifrost'
import { CustomInput, HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'
import { formatUserForCreate, getAddressByZipCode, registerUser } from '../services/CustomerService'
import { navigate, openBrowser, PAGES } from '../services/NavigationService'
import { logError, logScreenView } from '../services/TrackingService'
import { PERSON_TYPE, UF } from '../utils/Constants'
import ModalMessage from '../components/ModalMessage'

export default function Register(props) {
	const PAGE = 'Registrar usuário'

	const [loading, setLoading] = useState(false)

	const [formData, setFormData] = useState({})
	const [errors, setErrors] = useState({})

	const [personType, setPersonType] = useState(PERSON_TYPE.PERSON)
	const [showModalError, setShowModalError] = useState(false)
	const [msgErrorModal, setMsgErrorModal] = useState([])

	useEffect(() => {
		window.scrollTo(0, 0)
		logScreenView(PAGE)
	}, [])

	const friendlyError = msg => {
		let errors = []

		try {
			const _parseMsg = JSON.parse(msg)
			if (_parseMsg) {
				msg = _parseMsg
			}
		} catch (e) {}

		if (typeof msg === 'string') {
			errors.push(convertMessageError(msg))
		} else if (Array.isArray(msg)) {
			errors = msg.map(m => convertMessageError(m.message))
		} else {
			errors.push(msg)
		}

		setMsgErrorModal(errors)
		setShowModalError(true)
	}

	const convertMessageError = msg => {
		// TODO: Fazer a conversão do erro
		return msg
	}

	const register = async () => {
		if (!formData.appPrivacy) {
			setErrors(prev => ({
				...prev,
				['appPrivacy']: 'Você precisa aceitar os termos de uso e política de privacidade'
			}))
			return
		}

		const requiredFields = [
			'email',
			'cpf',
			'fullName',
			'birthDate',
			'password',
			'passwordConfirmation',
			'primaryPhoneNumber',
			'receiverName',
			'cep',
			'address',
			'addressNumber',
			'neighborhood',
			'city',
			'state'
		]

		const fieldLabels = {
			email: 'E-mail',
			cpf: 'CPF',
			fullName: 'Nome completo',
			birthDate: 'Data de nascimento',
			password: 'Senha',
			passwordConfirmation: 'Confirmação da senha',
			primaryPhoneNumber: 'Celular principal',
			receiverName: 'Nome do destinatário',
			cep: 'CEP',
			address: 'Rua',
			addressNumber: 'Número',
			neighborhood: 'Bairro',
			city: 'Cidade',
			state: 'Estado'
		}

		const newErrors = {}

		requiredFields.forEach(field => {
			if (!formData[field] || formData[field].trim() === '') {
				const fieldLabel = fieldLabels[field] || field

				newErrors[field] = `${fieldLabel} é obrigatório`
			}
		})

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		const formatedUser = formatDataUser()

		if (formatedUser) {
			setLoading(true)

			try {
				console.log('registerUser', JSON.stringify(formatedUser))
				const r = await registerUser(formatedUser)
				console.log('registerUser', JSON.stringify(r))
				navigate(PAGES.LOGIN, { msgSuccess: 'Cadastro realizado com sucesso.' }, true)
			} catch (e) {
				logError('Error register', e)
				friendlyError(e.message)
			}

			setLoading(false)
		}
	}

	/**
	 * Formata os dados do usuário para criação Wake e trata erros de formulário se necessário
	 * @returns {Object} O objeto com os dados do usuário formatado ou null em caso de erro
	 * @see {@link https://wakecommerce.readme.io/docs/storefront-api-customercreate}
	 */
	const formatDataUser = () => {
		try {
			const formatedUser = formatUserForCreate(personType, formData)
			return formatedUser
		} catch (e) {
			logError('Error formatDataUser', e)
			if (e.name && e.name.startsWith('ValidationError_')) {
				const field = e.name.replace('ValidationError_', '')

				setErrors(prev => ({ ...prev, [field]: e.message }))

				const element = document.getElementById(`frm_${field}`)
				element.focus()
			} else {
				friendlyError(e.message)
			}
			return null
		}
	}

	const handleChange = (field, value) => {
		setFormData({ ...formData, [field]: value })
		setErrors(prev => ({ ...prev, [field]: '' }))
	}

	const closeModal = () => {
		setMsgErrorModal([])
		setShowModalError(false)
	}

	const onZipCodeChange = async zipCode => {
		const zipCodeNumeric = zipCode.replace(/\D/g, '')

		handleChange('cep', zipCode)

		if (zipCodeNumeric.length === 8) {
			try {
				const address = await getAddressByZipCode(zipCodeNumeric)

				setFormData({
					...formData,
					address: address?.street,
					neighborhood: address?.neighborhood,
					city: address?.city,
					state: address?.state,
					cep: zipCode
				})
			} catch (error) {
				console.error('Error fetching address:', error)
				logError('Error onZipCodeChange', error)

				setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }))
			}
		}
	}

	const openPrivacyPage = () => {
		openBrowser(PAGE, 'https://www.loja.com.br/central-privacidade', true)
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>Cadastro</Text>
				</View>
			</HeaderContentWrapper>

			{loading ? (
				<View className='flex h-full w-full items-center justify-center'>
					<Loading />
				</View>
			) : (
				<View className='p-4'>
					<View className='hidden flex-col gap-2 bg-green-100'>
						<View
							className='flex items-center gap-2'
							sendFocusToInput>
							<Radio
								name='personType'
								value={PERSON_TYPE.PERSON}
								checked={personType === PERSON_TYPE.PERSON}
								onChange={() => setPersonType(PERSON_TYPE.PERSON)}
							/>
							<Text>PESSOA FÍSICA (CPF)</Text>
						</View>

						<View
							className='flex items-center gap-2'
							sendFocusToInput>
							<Radio
								name='personType'
								value={PERSON_TYPE.COMPANY}
								checked={personType === PERSON_TYPE.COMPANY}
								onChange={() => setPersonType(PERSON_TYPE.COMPANY)}
							/>
							<Text>PESSOA JURÍDICA (CNPJ)</Text>
						</View>
					</View>

					<View className='flex w-full flex-col gap-4'>
						<Text className='text-base font-bold'>Dados Pessoais</Text>

						<View className='flex w-full flex-col gap-1'>
							<CustomInput
								id='frm_email'
								className={`input input-bordered h-9 ${errors?.email ? 'input-error' : ''}`}
								label='E-mail *'
								value={formData.email}
								onChange={e => handleChange('email', e.target.value)}
								type='email'
								inputMode='email'
								nextInputOnSubmit={personType === PERSON_TYPE.PERSON ? 'frm_cpf' : 'frm_cnpj'}
								error={errors?.email}
							/>
						</View>

						{personType === PERSON_TYPE.PERSON && (
							<View className='flex w-full flex-col gap-4'>
								<View className='flex w-full flex-col gap-1'>
									<CustomInput
										id='frm_cpf'
										className={`input input-bordered h-9 ${errors?.cpf ? 'input-error' : ''}`}
										label='CPF *:'
										variant='mask'
										mask='999.999.999-99'
										value={formData.cpf || ''}
										onChange={e => handleChange('cpf', e.target.value)}
										nextInputOnSubmit='frm_fullName'
										error={errors?.cpf}
									/>
								</View>

								<View className='flex w-full flex-col gap-1'>
									<CustomInput
										id='frm_fullName'
										className={`input input-bordered h-9 ${errors?.fullName ? 'input-error' : ''}`}
										label='Nome completo *:'
										value={formData.fullName}
										type='text'
										inputMode='text'
										nextInputOnSubmit='frm_birthDate'
										onChange={e => handleChange('fullName', e.target.value)}
										error={errors?.fullName}
									/>
								</View>

								<View className='flex w-full flex-col gap-4'>
									<View className='flex w-full flex-col gap-1'>
										<CustomInput
											id='frm_birthDate'
											className={`input input-bordered h-9 ${
												errors?.birthDate ? 'input-error' : ''
											}`}
											label='Data de nascimento *:'
											placeholder='Ex: 10/06/2002'
											variant='mask'
											mask='99/99/9999'
											value={formData.birthDate || ''}
											onChange={e => handleChange('birthDate', e.target.value)}
											nextInputOnSubmit='frm_gender'
											error={errors?.birthDate}
										/>
									</View>

									<View className='flex w-full flex-col gap-1'>
										<Text className='text-xs'>Sexo:</Text>

										<Select
											id='frm_gender'
											className={`!rounded-none !min-h-8 !h-8 font-normal ${
												errors?.gender ? 'select-error' : ''
											}`}
											value={formData.gender}
											nextInputOnSubmit='frm_password'
											onChange={e => handleChange('gender', e.target.value)}>
											<Select.Item value='MALE'>Masculino</Select.Item>

											<Select.Item value='FEMALE'>Feminino</Select.Item>
										</Select>
									</View>
								</View>
							</View>
						)}

						{personType === PERSON_TYPE.COMPANY && (
							<View className='flex w-full flex-col gap-4'>
								<View className='flex w-full flex-col gap-1'>
									<CustomInput
										id='frm_cnpj'
										className={`input input-bordered h-9 ${errors?.cnpj ? 'input-error' : ''}`}
										mask='99.999.999/9999-99'
										label='Cnpj *:'
										value={formData.cnpj || ''}
										onChange={e => handleChange('cnpj', e.target.value)}
										type='number'
										inputMode='numeric'
										nextInputOnSubmit='frm_corporateName'
									/>
								</View>

								<View className='flex w-full flex-col gap-1'>
									<CustomInput
										id='frm_corporateName'
										className={`input input-bordered h-9 ${
											errors?.corporateName ? 'input-error' : ''
										}`}
										value={formData.corporateName}
										label='Razão social *:'
										type='text'
										inputMode='text'
										nextInputOnSubmit='frm_password'
										onChange={e => handleChange('corporateName', e.target.value)}
									/>
								</View>
							</View>
						)}

						<View className='flex w-full flex-col gap-1'>
							<CustomInput
								id='frm_password'
								label='Informe a senha *:'
								className={`input input-bordered h-9 ${errors?.password ? 'input-error' : ''}`}
								value={formData.password}
								onChange={e => handleChange('password', e.target.value)}
								type='password'
								nextInputOnSubmit='frm_passwordConfirmation'
								error={errors?.password}
							/>
						</View>

						<View className='flex w-full flex-col gap-1'>
							<CustomInput
								id='frm_passwordConfirmation'
								label='Confirme a senha *:'
								className={`input input-bordered h-9 ${
									errors?.passwordConfirmation ? 'input-error' : ''
								}`}
								value={formData.passwordConfirmation}
								onChange={e => handleChange('passwordConfirmation', e.target.value)}
								type='password'
								nextInputOnSubmit='frm_primaryPhoneNumber'
								error={errors?.passwordConfirmation}
							/>
						</View>

						<View className='flex w-full flex-col gap-1'>
							<CustomInput
								id='frm_primaryPhoneNumber'
								className={`input input-bordered h-9 ${
									errors?.primaryPhoneNumber ? 'input-error' : ''
								}`}
								mask='(99) 99999-9999'
								variant='mask'
								label='Celular principal *:'
								value={formData.primaryPhoneNumber || ''}
								onChange={e => handleChange('primaryPhoneNumber', e.target.value)}
								nextInputOnSubmit='frm_secondaryPhoneNumber'
								error={errors?.primaryPhoneNumber}
							/>
						</View>

						<View className='flex w-full flex-col gap-1'>
							<CustomInput
								id='frm_secondaryPhoneNumber'
								className={`input input-bordered h-9 ${
									errors?.secondaryPhoneNumber ? 'input-error' : ''
								}`}
								variant='mask'
								mask='(99) 99999-9999'
								label='Celular secundário:'
								value={formData.secondaryPhoneNumber || ''}
								onChange={e => handleChange('secondaryPhoneNumber', e.target.value)}
								nextInputOnSubmit='frm_newsletter'
							/>
						</View>

						<View
							className='mt-4 flex items-center gap-2'
							sendFocusToInput>
							<Checkbox
								id='frm_newsletter'
								className='!w-4 !h-4 !rounded-none'
								name='newsletter'
								value={formData.newsletter}
								checked={formData.newsletter}
								onChange={e => handleChange('newsletter', value?.checked)}
							/>
							<Text>Aceito receber dicas e promoções da loja</Text>
						</View>
					</View>

					<View className='mt-12 flex w-full flex-col items-start gap-4 pb-8'>
						<Text className='text-lg text-primary-300 font-serif font-medium'>Endereço de cadastro</Text>

						<View className='w-full'>
							<View className='flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_receiverName'
									className={`input input-bordered h-9 ${errors?.receiverName ? 'input-error' : ''}`}
									value={formData.receiverName}
									label='Nome do destinatário *:'
									type='text'
									inputMode='text'
									nextInputOnSubmit='frm_cep'
									onChange={e => handleChange('receiverName', e.target.value)}
									error={errors?.receiverName}
								/>
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_cep'
									className={`input input-bordered h-9 ${errors?.cep ? 'input-error' : ''}`}
									variant='mask'
									mask='99999-999'
									value={formData.cep || ''}
									label='Cep *:'
									onChange={e => onZipCodeChange(e.target.value)}
									nextInputOnSubmit='frm_address'
									error={errors?.cep}
								/>
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_address'
									className={`input input-bordered h-9 ${errors?.address ? 'input-error' : ''}`}
									value={formData.address}
									label='Rua *:'
									type='text'
									inputMode='text'
									nextInputOnSubmit='frm_addressNumber'
									onChange={e => handleChange('address', e.target.value)}
									error={errors?.address}
								/>
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_addressNumber'
									className={`input input-bordered h-9 ${errors?.addressNumber ? 'input-error' : ''}`}
									value={formData.addressNumber}
									label='Número *:'
									type='text'
									inputMode='text'
									nextInputOnSubmit='frm_addressComplement'
									onChange={e => handleChange('addressNumber', e.target.value)}
									error={errors?.addressNumber}
								/>
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_addressComplement'
									className={`input input-bordered h-9 ${
										errors?.addressComplement ? 'input-error' : ''
									}`}
									value={formData.addressComplement}
									label='Complemento:'
									type='text'
									inputMode='text'
									nextInputOnSubmit='frm_neighborhood'
									onChange={e => handleChange('addressComplement', e.target.value)}
								/>
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_neighborhood'
									className={`input input-bordered h-9 ${errors?.neighborhood ? 'input-error' : ''}`}
									value={formData.neighborhood}
									label='Bairro *:'
									type='text'
									inputMode='text'
									nextInputOnSubmit='frm_city'
									onChange={e => handleChange('neighborhood', e.target.value)}
									error={errors?.neighborhood}
								/>
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_city'
									className={`input input-bordered h-9 ${errors?.city ? 'input-error' : ''}`}
									value={formData.city}
									label='Cidade *:'
									type='text'
									inputMode='text'
									nextInputOnSubmit='frm_state'
									onChange={e => handleChange('city', e.target.value)}
									error={errors?.city}
								/>
							</View>

							<View className='mt-4 flex w-full flex-col gap-1'>
								<Text className='text-xs'>Estado *:</Text>
								<Select
									id='frm_state'
									className={`!rounded-none w-full !min-h-8 !h-8 font-normal ${
										errors?.state ? 'select-error' : ''
									}`}
									value={formData.state}
									maxLength='2'
									nextInputOnSubmit='frm_reference'
									onChange={e => handleChange('state', e.target.value)}>
									{UF.map(option => (
										<Select.Item
											key={option.value}
											value={option.value}>
											{option.label}
										</Select.Item>
									))}
								</Select>

								{errors?.state && (
									<Text className='text-[10px] font-light text-negative-700'>{errors.state}</Text>
								)}
							</View>
							<View className='mt-4 flex w-full flex-col gap-1'>
								<CustomInput
									id='frm_reference'
									className={`input input-bordered h-9 ${errors?.reference ? 'input-error' : ''}`}
									value={formData.reference}
									label='Referência de entrega:'
									type='text'
									inputMode='text'
									onChange={e => handleChange('reference', e.target.value)}
								/>
							</View>
						</View>

						<View
							className='flex items-start gap-2'
							sendFocusToInput>
							<Checkbox
								id='frm_appPrivacy'
								className='!w-4 !h-4 !rounded-none'
								name='appPrivacy'
								value={formData.appPrivacy}
								checked={formData.appPrivacy}
								onChange={e => handleChange('appPrivacy', e.target.checked)}
							/>

							<View className='flex flex-col'>
								<Text className='text-xs font-light'>Termos de Uso e Política de Privacidade</Text>

								<Text className='text-xs font-light'>
									Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
									Recomendamos que leia atentamente ambos os documentos para entender como seus dados
									serão utilizados e protegidos.
								</Text>

								<Text className='text-xs font-light'>
									Você pode revogar seu consentimento a qualquer momento através das configurações de
									sua conta.
								</Text>
							</View>
						</View>

						<View
							className='ml-6'
							onClick={openPrivacyPage}>
							<Text className='text-xs underline font-medium'>
								Ver Termos de Uso e Política de Privacidade
							</Text>
						</View>

						{errors?.appPrivacy && (
							<Text className={`text-sm text-error w-full text-center font-bold`}>
								{errors?.appPrivacy}
							</Text>
						)}
						{!errors?.appPrivacy && Object.values(errors).some(v => v) && (
							<Text className={`text-sm text-error w-full text-center font-bold`}>
								Há campos com erro. Revise-os antes de continuar.
							</Text>
						)}
					</View>

					<View className='mb-4 w-full'>
						<Button
							className='bg-primary text-primary-content !rounded-none w-full !font-medium text-xs !h-9 !min-h-9'
							onClick={register}>
							Cadastrar
						</Button>
					</View>

					<ModalMessage
						title={'Não foi possível concluir seu cadastro'}
						text={'Por favor, revise as informações fornecidas e tente novamente.'}
						showModal={showModalError}
						closeModal={closeModal}>
						<View className='flex flex-col gap-2 mt-4 w-full justify-left'>
							{msgErrorModal.map(m => (
								<Text className='text-xs text-error'>{m}</Text>
							))}
						</View>
					</ModalMessage>
				</View>
			)}

			<View bottomInset='auto' />
		</Page>
	)
}
