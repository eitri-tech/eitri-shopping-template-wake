import { Image } from 'eitri-luminus'
import chevronDownIcon from '../../assets/images/chevron-down.svg'
import chevronUpIcon from '../../assets/images/chevron-up.svg'

export default function CollapsableView(props) {
	const { children, title } = props

	const [collapsed, setCollapsed] = useState(true)

	useEffect(() => {
		setCollapsed(true)
	}, [title])

	const toggleCollapsedState = () => {
		setCollapsed(!collapsed)
	}

	return (
		<View>
			<View
				display='flex'
				alignItems='center'
				justifyContent='between'
				onClick={toggleCollapsedState}>
				<Text>{title}</Text>

				<Image
					src={collapsed ? chevronDownIcon : chevronUpIcon}
					width={24}
					height={24}
				/>
			</View>
			{!collapsed && <View marginVertical='small'>{children}</View>}
		</View>
	)
}
