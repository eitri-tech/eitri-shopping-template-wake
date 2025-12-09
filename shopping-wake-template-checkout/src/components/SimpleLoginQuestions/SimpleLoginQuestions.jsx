export default function SimpleLoginQuestions(props) {
	const { question, onSelect } = props

	return (
		<View>
			<View>
				<Text className='font-bold block text-sm'>Que bom que você voltou!</Text>
				<Text className='block text-xs mt-4'>
					Identificamos que você já possui cadastro. Para sua segurança, selecione a opção correta para
					continuar:
				</Text>
			</View>
			<View className='mt-4'>
				<Text className='font-semibold text-center block text-sm'>{question.question}</Text>
				<View className='flex flex-col gap-3 mt-2'>
					{question.answers.map((answer, index) => (
						<View
							key={answer.id}
							className='border border-primary-500 p-2 flex justify-center'
							onClick={() => onSelect(question.questionId, answer.id)}>
							<Text className='text-sm'>{answer.value}</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	)
}
