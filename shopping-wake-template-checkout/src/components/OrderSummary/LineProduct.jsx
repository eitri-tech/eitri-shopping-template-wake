import { formatImageUrl, formatCurrency } from "../../utils/Util"

export default function LineProduct(props) {
    const { name, imageUrl, formatedPrice, price } = props
    
    return (
        <View
            key={name}
            className='flex flex-row justify-between gap-2'>
            <View width={'20%'}>
                <Image
                    src={formatImageUrl(imageUrl, null, 100)}
                    className='w-full bg-top bg-no-repeat bg-cover bg-fixed shadow-sm object-cover min-h-[100px]'
                />
            </View>

            <View
                width={'80%'}
                className='flex flex-ror justify-between pt-2 pl-2 gap-2'>
                <View className='flex flex-wrap'>
                    <Text className='text-sm'>{name}</Text>
                </View>

                {(formatedPrice || price) &&
                    <Text className='text-sm'>{formatedPrice || formatCurrency(price)}</Text>
                }
            </View>
        </View>
    )

}