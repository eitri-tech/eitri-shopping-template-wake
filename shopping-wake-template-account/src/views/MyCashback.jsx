import Eitri from 'eitri-bifrost'
import { Accordion, Button, Image, Link, Modal, Page, Text, TextInput, View } from 'eitri-luminus'
import { useCallback, useState } from 'react'
import close from '../assets/icons/close-white.svg'
import closeModal from '../assets/icons/close_black.svg'
import items from '../assets/icons/items.svg'
import { mensagem } from '../utils/cashback'
import { CustomInput } from 'shopping-wake-template-shared'

export default function MyCashback() {
	const PAGE = 'Meu Cashback'

	const [showModal, setShowModal] = useState(false)
	const [textInput, setTextInput] = useState('')
	const [typeInput, setTypeInput] = useState(true)
	const [submitForm, setSubmitForm] = useState(false)
	const [statusForm, setStatusForm] = useState(false)
	const [saldoCashback, setSaldoCashback] = useState(0)
	const [openIndex, setOpenIndex] = useState(null)

	const semSaldoMsg = `${
		typeInput ? `o cpf ${textInput}` : `o número ${textInput}`
	} ainda não tem saldo disponível por aqui.`

	const comSaldoMsg = () => (
		<View className='flex flex-col items-center mt-2'>
			<Text className='text-center'>tem cashback te esperando!</Text>

			<Text className='text-center'>{`Seu saldo é de R$ ${saldoCashback.toFixed(2)}`}</Text>
		</View>
	)

	const toggleTypeInput = () => {
		setTypeInput(!typeInput)
		setTextInput('')
	}

	const formatCPF = value => {
		const numbers = value.replace(/\D/g, '').slice(0, 11)
		return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
	}

	const formatPhone = value => {
		const numbers = value.replace(/\D/g, '').slice(0, 11)
		if (numbers.length <= 10) {
			return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
		}
		return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
	}

	const changeInput = value => {
		let formattedValue = ''

		formattedValue = typeInput ? formatCPF(value) : formatPhone(value)

		setTextInput(formattedValue)
	}

	const formSubmitEvent = async () => {
		const cleanValue = textInput.replace(/\D/g, '')

		if (!cleanValue) return

		try {
			const params = new URLSearchParams({
				phone: typeInput ? cleanValue : `55${cleanValue}`
			})

			// TODO: Validar URL de Cashback
			const VTEX_CASHBACK_URL = `https://www.site.com.br/_v/cashback?${params}`

			const response = await Eitri.http.get(VTEX_CASHBACK_URL)

			setSaldoCashback(parseFloat(response?.data?.SaldoBonus) || 0)

			setStatusForm(response?.status === 200)
			setSubmitForm(true)
		} catch (error) {
			console.warn('Erro ao enviar o formulário:', error)
		}
	}

	const handleToggle = useCallback(
		index => {
			setOpenIndex(openIndex === index ? null : index)
		},
		[openIndex]
	)

	const openConsultModal = () => {
		setSubmitForm(false)
		setTextInput('')
		setTypeInput(true)
		setShowModal(true)
	}

	const openURL = async (url, inApp = false) => {
		await Eitri.openBrowser({ url: url, inApp })
	}

	const onBack = () => {
		Eitri.navigation.back()
	}

	// TODO: validar URL
	return (
		<Page title={PAGE}>
			<Modal
				id='cashback-modal'
				className={`bg-transparent modal modal-middle ${showModal ? 'modal-open' : ''}`}>
				<View className='flex flex-col items-center justify-between justify-self-center bg-accent-300 max-w-[300px] min-h-[244px] max-h-[244px]'>
					<Image
						src='https://loja.vtexassets.com/assets/vtex.file-manager-graphql/images/67ff26d0-8954-4f4e-96e8-29726dd5fba0___0f3ae98899be40380db3399f74646ddb.png'
						width='206px'
						height='40px'
					/>
					<Button
						className='bg-transparent border-none absolute right-4 top-4'
						onClick={() => setShowModal(false)}>
						<Image
							width='20px'
							height='20px'
							src={closeModal}
						/>
					</Button>

					{submitForm && statusForm ? (
						saldoCashback > 0 ? (
							<>
								{comSaldoMsg()}

								<Text className='mt-1 text-center px-12'>
									agora, é só clicar no botão, receber o seu cupom por SMS e aproveitar em peças que
									acabaram de chegar.
								</Text>

								<View className='mt-2 w-full max-w-[206px]'>
									<Button
										className='!min-h-8 !h-8 !text-accent-300 !font-normal !rounded-none text-xs w-full'
										onClick={() => openURL('https://www.crmbonus.com/ecc2/NDgzMw==', true)}>
										resgatar
									</Button>
								</View>
							</>
						) : (
							<>
								<Text className='text-center px-8'>{semSaldoMsg}</Text>

								<Text className='text-center px-8'>
									escolha seus favoritos e garanta 10% de cashback.
								</Text>

								<View className='w-full max-w-[206px]'>
									<Button
										className='!min-h-8 !h-8 !text-accent-300 !font-normal !rounded-none text-xs w-full'
										onClick={onBack}>
										voltar
									</Button>
								</View>
							</>
						)
					) : submitForm && !statusForm ? (
						<>
							<Text className='text-center px-12'>
								Estamos enfrentando problemas internos, tente novamente mais tarde
							</Text>
							<View />
						</>
					) : (
						<>
							<Text>consulte seu saldo:</Text>

							<CustomInput
								value={textInput}
								name={typeInput ? 'cpf' : 'phone'}
								type='tel'
								placeholder={typeInput ? '000.000.000-00' : '(00) 00000-0000'}
								className='text-center focus-within:!border-none focus-within:!outline-offset-0'
								onChange={e => changeInput(e.target.value)}
								required
							/>

							<View onClick={() => toggleTypeInput()}>
								<Text className='text-primary-100 text-xs underline'>
									{typeInput ? 'ou use seu celular' : 'ou use seu cpf'}
								</Text>
							</View>

							<Button
								className='bg-primary-100 !text-accent-300 !rounded-none !h-8 !min-h-8 w-full !font-normal text-xs'
								onClick={formSubmitEvent}>
								consultar
							</Button>
						</>
					)}
				</View>
			</Modal>

			<View className='relative'>
				<Button
					className='bg-transparent border-none absolute top-12 left-4 p-0 h-auto min-h-0'
					onClick={() => onBack()}>
					<Image
						width='14px'
						height='13px'
						src={close}
					/>
				</Button>

				<View className='absolute flex justify-center items-center gap-1 top-[120px] left-1/2 -translate-x-1/2'>
					<Text className='text-sm text-accent-500'>loja / </Text>

					<Text className='font-medium text-sm text-accent-300'>cashback</Text>
				</View>

				<Image
					src='https://loja.vtexassets.com/assets/vtex.file-manager-graphql/images/c11483e5-eb7e-4374-a2a9-3b2e85f87b1c___3008ec5079116bb559c53a5ade1cee1c.png'
					className='h-[95vh] object-cover w-full'
				/>

				<View className='absolute bottom-[100px] left-1/2 w-full -translate-x-1/2 px-[10px]'>
					<View className='w-full flex flex-col items-center px-5'>
						<Text className='text-accent-300 mb-[18px] font-light opacity-80'>COMO FUNCIONA?</Text>

						<Text className='text-accent-300 text-xs leading-tight text-center opacity-80'>...</Text>

						<View className='flex justify-center items-center w-full gap-2 mt-8'>
							<Button
								className='bg-transparent !font-normal !h-9 !min-h-9 !text-accent-300 border-neutral-300 opacity-80 w-[48%] !rounded-none'
								onClick={openConsultModal}>
								consultar
							</Button>

							<Button
								className='bg-transparent !font-normal !h-9 !min-h-9 !text-accent-300 border-neutral-300 opacity-80 w-[48%] !rounded-none'
								onClick={() => openURL('https://www.crmbonus.com/ecc2/NDgzMw==', true)}>
								resgatar
							</Button>
						</View>
					</View>
				</View>
			</View>

			<View className='w-full px-8 mt-8'>
				{mensagem.map((section, index) => (
					<View
						key={index}
						className='mb-4 w-full flex flex-col'>
						{!section.details && <Text className='mb-[14px] text-center'>{section.title}</Text>}

						{section.details ? (
							<Accordion
								name='faq-accordion'
								className='collapse-arrow border-none mt-3 !rounded-none'
								checked={openIndex === index}
								onChange={() => handleToggle(index)}>
								<Accordion.Title className='flex items-center !p-0 !min-h-6 text-xs'>
									{section.title}
								</Accordion.Title>

								<Accordion.Content>
									{section.text.map((line, lineIndex) => {
										if (typeof line === 'object' && line.isLink) {
											return (
												<View
													key={lineIndex}
													className='mb-3'>
													<Text className='inline'>{line.preLinkText}</Text>
													<Link
														className='underline text-primary-500'
														onClick={() => openURL(line.linkUrl)}>
														{line.linkText}
													</Link>

													<Text className='inline'>{line.postLinkText}</Text>
												</View>
											)
										} else {
											return (
												<Text
													key={lineIndex}
													className='mb-3 text-xs text-left'>
													{line}
												</Text>
											)
										}
									})}
								</Accordion.Content>
							</Accordion>
						) : (
							section.text.map((line, lineIndex) => {
								if (typeof line === 'object' && line.isLink) {
									return (
										<View
											key={lineIndex}
											className={lineIndex !== section.text.length - 1 ? 'mb-3' : 'mb-4'}>
											<Text className='inline'>{line.preLinkText}</Text>

											<Link
												className='underline text-primary-500'
												onClick={() => openURL(line.linkUrl)}>
												{line.linkText}
											</Link>
											<Text className='inline'>{line.postLinkText}</Text>
										</View>
									)
								} else {
									return (
										<Text
											key={lineIndex}
											className={`${
												lineIndex !== section.text.length - 1 ? 'mb-3' : 'mb-4'
											} text-xs text-center`}>
											{line}
										</Text>
									)
								}
							})
						)}

						{index !== mensagem.length - 1 ? (
							<View className='flex justify-center w-full'>
								<Image
									height={10}
									width={10}
									src={items}
								/>
							</View>
						) : null}
					</View>
				))}
			</View>
		</Page>
	)
}
