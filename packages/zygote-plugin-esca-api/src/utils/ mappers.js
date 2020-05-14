const infoToShipping = ({
	infoFirstName: first_name,
	infoLastName: last_name,
	shippingAddress1: street1,
	shippingAddress2: street2,
	shippingCity: city,
	shippingStateAbbr: state,
	shippingZip: zip,
	infoPhone: phone = ``,
	infoEmail: email,
	country = `US`,
} = {}, products) => {
	return {
		destination: {
			first_name = first_name,
			last_name = last_name,
			street1 = street1,
			street2 = street2,
			city = city,
			state = state,
			zip = zip,
			phone = phone,
			email = email,
			country = country,
		} = {},
		products,
	}
}


export {
	infoToShipping,
}