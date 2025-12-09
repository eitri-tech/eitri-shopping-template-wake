import cardIcon from './../assets/images/cardIcon.svg'
import billingIcon from './../assets/images/billingIcon.svg'
import pixIcon from './../assets/images/pixIcon.svg'
import checkingAccountIcon from './../assets/images/dollar-bill.svg'

export const PERSON_TYPE = {
	PERSON: 'PERSON',
	COMPANY: 'COMPANY'
}

export const PAYMENT_METHODS = {
	CREDIT_CARD: 'CREDIT_CARD',
	INSTANT_PAYMENT: 'INSTANT_PAYMENT',
	BILLING: 'BILLING',
	CHECKING_ACCOUNT: 'CHECKING_ACCOUNT'
}

export const PAYMENT_METHODS_ICONS = {
	[PAYMENT_METHODS.CREDIT_CARD]: cardIcon,
	[PAYMENT_METHODS.INSTANT_PAYMENT]: pixIcon,
	[PAYMENT_METHODS.BILLING]: billingIcon,
	[PAYMENT_METHODS.CHECKING_ACCOUNT]: checkingAccountIcon
}

export const PAYMENT_METHODS_TITLE = {
	[PAYMENT_METHODS.CREDIT_CARD]: 'Cartão de crédito',
	[PAYMENT_METHODS.INSTANT_PAYMENT]: 'Pix',
	[PAYMENT_METHODS.BILLING]: 'Boleto',
	[PAYMENT_METHODS.CHECKING_ACCOUNT]: 'Vale Conta Corrente'
}

export const FIELD_TYPE = {
	STRING: 'STRING',
	NUMBER: 'NUMBER',
	DATE: 'DATE',
	BOOLEAN: 'BOOLEAN'
}

export const GENDER = {
	MALE: 'MALE',
	FEMALE: 'FEMALE'
}

export const ERR_MSG = {
	REQUIRED: 'Campo obrigatório',
	INVALID_VALUE: 'Valor inválido',
	INVALID_CPF: 'CPF inválido',
	INVALID_CNPJ: 'CNPJ inválido',
	INVALID_PASS_CONFIRMATION: 'Confirmação de Senha e Senha devem ser iguais'
}

export const PRODUCT_GROUP = {
	BRAND: 'BRAND',
	CATEGORY: 'CATEGORY',
	HOTSITE: 'HOTSITE'
}

export const PRODUCT_SORT_TYPE = {
	NAME: 'NAME',
	SALES: 'SALES',
	PRICE: 'PRICE',
	DISCOUNT: 'DISCOUNT',
	RANDOM: 'RANDOM',
	RELEASE_DATE: 'RELEASE_DATE',
	STOCK: 'STOCK'
}

export const UF = [
	{ label: 'Acre', value: 'AC' },
	{ label: 'Alagoas', value: 'AL' },
	{ label: 'Amapá', value: 'AP' },
	{ label: 'Amazonas', value: 'AM' },
	{ label: 'Bahia', value: 'BA' },
	{ label: 'Ceará', value: 'CE' },
	{ label: 'Distrito Federal', value: 'DF' },
	{ label: 'Espírito Santo', value: 'ES' },
	{ label: 'Goiás', value: 'GO' },
	{ label: 'Maranhão', value: 'MA' },
	{ label: 'Mato Grosso', value: 'MT' },
	{ label: 'Mato Grosso do Sul', value: 'MS' },
	{ label: 'Minas Gerais', value: 'MG' },
	{ label: 'Pará', value: 'PA' },
	{ label: 'Paraíba', value: 'PB' },
	{ label: 'Paraná', value: 'PR' },
	{ label: 'Pernambuco', value: 'PE' },
	{ label: 'Piauí', value: 'PI' },
	{ label: 'Rio de Janeiro', value: 'RJ' },
	{ label: 'Rio Grande do Norte', value: 'RN' },
	{ label: 'Rio Grande do Sul', value: 'RS' },
	{ label: 'Rondônia', value: 'RO' },
	{ label: 'Roraima', value: 'RR' },
	{ label: 'Santa Catarina', value: 'SC' },
	{ label: 'São Paulo', value: 'SP' },
	{ label: 'Sergipe', value: 'SE' },
	{ label: 'Tocantins', value: 'TO' }
]

export const SORT_DIRECTION = {
	ASC: 'ASC',
	DESC: 'DESC'
}

export const LIST_ORDERING = {
	key: 'ordering',
	title: 'Ordenar por',
	values: [
		{
			id: 'OrderByTopSaleDESC',
			categoryKey: 'ordering',
			name: 'Mais vendidos',
			sortType: 'SALES',
			direction: 'DESC'
		},
		{
			id: 'OrderByReleaseDateDESC',
			categoryKey: 'ordering',
			name: 'Mais recentes',
			sortType: 'RELEASE_DATE',
			direction: 'DESC'
		},
		{
			id: 'OrderByBestDiscountDESC',
			categoryKey: 'ordering',
			name: 'Descontos',
			sortType: 'DISCOUNT',
			direction: 'DESC'
		},
		{
			id: 'OrderByPriceDESC',
			categoryKey: 'ordering',
			name: 'Maior preço',
			sortType: 'PRICE',
			direction: 'DESC'
		},
		{
			id: 'OrderByPriceASC',
			categoryKey: 'ordering',
			name: 'Menor preço',
			sortType: 'PRICE',
			direction: 'ASC'
		},
		{
			id: 'OrderByNameASC',
			categoryKey: 'ordering',
			name: 'De A a Z',
			sortType: 'NAME',
			direction: 'ASC'
		},
		{
			id: 'OrderByNameDESC',
			categoryKey: 'ordering',
			name: 'De Z a A',
			sortType: 'NAME',
			direction: 'DESC'
		}
	]
}
