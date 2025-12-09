import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { getMappedComponent } from '../../services/ComponentService'

export default function CmsContentRender(props) {
	const { cmsContent } = props

	const [key, setKey] = useState(new Date().getTime())

	useEffect(() => {
		if (cmsContent) {
			Eitri.navigation.setOnResumeListener(() => {
				const currentTime = new Date().getTime()
				setKey(currentTime)
			})
		}
	}, [cmsContent])

	return (
		<View className='flex flex-col  pb-4'>
			{cmsContent?.map((content, idx) => getMappedComponent(content, idx, key))}
		</View>
	)
}
