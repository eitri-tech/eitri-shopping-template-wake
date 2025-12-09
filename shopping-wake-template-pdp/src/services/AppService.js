import { Wake } from 'eitri-shopping-wake-shared'

export const startConfigure = async () => {
	await Wake.tryAutoConfigure({ gaVerbose: false, verbose: true })
}
