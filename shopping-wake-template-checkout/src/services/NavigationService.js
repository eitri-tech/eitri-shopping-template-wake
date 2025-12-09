import Eitri from 'eitri-bifrost'

export const openOrderDetails = async orderId => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'OrderDetail', orderId }
		})
	} catch (e) {
		console.error('navigate to order details: Error trying to open order details', e)
	}
}
