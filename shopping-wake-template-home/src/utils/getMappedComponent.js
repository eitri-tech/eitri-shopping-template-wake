import MultipleImageBanner from '../components/banner/MultipleImageBanner'

const componentMap = {
	MultipleImageBanner: MultipleImageBanner
}

export const getMappedComponent = (content, reloadKey) => {
	// console.log('getMappedComponent', content.component)
	const Component = componentMap[content.component]

	if (!Component) {
		console.error(`Component ${content.component} does not exist in the component map.`)
		return null
	}

	try {
		return (
			<Component
				key={content.id}
				reloadKey={reloadKey}
				data={content.data}
			/>
		)
	} catch (error) {
		console.error(`Error rendering component ${content.component}:`, error)
		return null
	}
}
