import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'

export default class StorageService {
	static async setStorageItem(key, item) {
		const { account } = Wake.configs
		return Eitri.sharedStorage.setItem(`${account}_${key}`, item)
	}

	static async getStorageItem(key) {
		const { account } = Wake.configs
		return Eitri.sharedStorage.getItem(`${account}_${key}`)
	}

	static async setStorageJSON(key, item) {
		try {
			const { account } = Wake.configs
			return Eitri.sharedStorage.setItem(`${account}_${key}`, JSON.stringify(item))
		} catch (e) {
			console.error('Erro ao salvar item no storage', e)
		}
	}

	static async getStorageJSON(key) {
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

	static async removeItem(key) {
		const { account } = Wake.configs
		return await Eitri.sharedStorage.removeItem(`${account}_${key}`)
	}
}
