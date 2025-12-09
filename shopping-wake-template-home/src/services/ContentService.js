import { Wake } from 'eitri-shopping-wake-shared'
import { queryContentHome } from '../queries/content'

export const getContentHome = async () => {
	const result = await Wake.graphQl.query(queryContentHome, {})
	return result?.contents?.nodes[0]?.content || null
}
