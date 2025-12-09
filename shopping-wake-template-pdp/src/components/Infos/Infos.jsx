import InfoContent from './componentes/InfoContent'

export default function Infos(props) {
	const { product } = props

	const INFOS = [
		{
			type: 'Sinopse',
			title: 'Descrição',
			content: product?.informations?.find(i => i.type === 'Sinopse')?.value || ''
		},
		{
			type: 'Especificações',
			title: 'Especificações',
			content: product?.informations?.find(i => i.type === 'Especificações')?.value || ''
		},
		{
			type: 'Cuidados',
			title: 'Cuidados com sua peça',
			content: product?.informations?.find(i => i.type === 'Cuidados')?.value || ''
		},
		{
			type: 'Prescrição',
			title: 'A modelo veste',
			content: product?.informations?.find(i => i.type === 'Prescrição')?.value || ''
		},
		{
			type: 'Tabela de medidas',
			title: 'Tabela de Medidas',
			content: product?.informations?.find(i => i.type === 'Tabela de Medidas')?.value || ''
		}
	]

	const [selectedInfo, setSelectedInfo] = useState('')

	const handelClick = infoType => {
		if (infoType === selectedInfo) return setSelectedInfo('')
		setSelectedInfo(infoType)
	}

	return (
		<View className={'flex flex-col px-4 gap-2 mt-2'}>
			{INFOS.map(info => (
				<InfoContent
					key={info.type}
					info={info}
					showInfo={selectedInfo === info.type}
					onClick={handelClick}
				/>
			))}
		</View>
	)
}
