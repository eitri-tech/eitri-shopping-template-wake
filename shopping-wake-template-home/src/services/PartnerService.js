import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { getStorageJSON } from './StorageService'
import { openZipCodeVerification } from './NavigationService'

let configPartner
export const getPartnerByZipCode = async (zipCode) => {
	return await Wake.store.getPartnersByZipCode(zipCode)
}

export const startFlowByRegion = async (zipCode) => {
	const partnerData = await getPartnerByZipCode(zipCode)

	if (!partnerData?.partnerAccessToken) {
		return false
	}

	await Wake.store.setGlobalZipCode(zipCode)
	await Wake.store.setPartnerAccessToken(partnerData.partnerAccessToken)
	return true
}

export const verifyFlowByRegion = async () => {
	const config = await Eitri.environment.getRemoteConfigs()
	console.log('verifyFlowByRegion config', config?.providerInfo?.partnerByRegion)
	if (!config?.providerInfo?.partnerByRegion) {
		return true
	}

	const zipCode = await Wake.store.getGlobalZipCode()
	console.log('verifyFlowByRegion zipCode', zipCode)
	if (!zipCode) {
		openZipCodeVerification()
		return false
	}
	
	const partnerData = await Wake.store.getPartnerAccessToken()
	console.log('verifyFlowByRegion partnerData', partnerData)
	if (!partnerData) {
		try {
			const result = await startFlowByRegion(zipCode)
			if (!result) {
				openZipCodeVerification()
				return false
			}
			return true
		} catch (e) {
			console.error('startFlowByRegion failed', e)
			openZipCodeVerification()
		}
	}

	// atualiza assincrono
	const startParams = await Eitri.getInitializationInfos()
	if (`${startParams?.tabIndex}` === '0' && !configPartner) { 
		try {
			startFlowByRegion(zipCode)
		} catch (e) {
			console.error('update Region failed', e)
		}
	}

	return true
}