import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'

// TODO - Jogar esse serviço para o Services.Shared
export const STGE_ITEM = {
	FAVORITE: 'favorite',
	CMS_CONFIG_HOME: 'cmsConfigHome',
	CMS_CONFIG_HOME_EXPIRES_AT: 'cmsConfigHomeExpiresAt'
}

export const setStorageItem = async (key, item) => {
	const { account } = Wake.configs
	return Eitri.sharedStorage.setItem(`${account}_${key}`, item)
}

export const getStorageItem = async key => {
	const { account } = Wake.configs
	return Eitri.sharedStorage.getItem(`${account}_${key}`)
}

export const setStorageJSON = async (key, item) => {
	try {
		const { account } = Wake.configs
		return Eitri.sharedStorage.setItem(`${account}_${key}`, JSON.stringify(item))
	} catch (e) {
		console.error('Erro ao salvar item no storage', e)
	}
}

export const getStorageJSON = async key => {
	const { account } = Wake.configs
	const data = await Eitri.sharedStorage.getItem(`${account}_${key}`)
	if (data) {
		try {
			return JSON.parse(data)
		} catch (e) {
			console.error('Erro ao fazer parse do JSON')
			return null
		}
	} else {
		return null
	}
}

export const removeItem = async key => {
	const { account } = Wake.configs
	return await Eitri.sharedStorage.removeItem(`${account}_${key}`)
}
