const  validateAddress = async (info, callback) => {
	//Validate address from the API
	var response = await callback({
		address: {
			street1: info.shippingAddress1,
			street2: info.shippingAddress2,
			city: info.shippingCity,
			state: info.shippingStateAbbr,
			zip: info.shippingZip,
			phone: info.infoPhone,
			email: info.infoEmail,
			country: `US`,
		},		
	})	
	if(!response.valid){
		throw new Error(response.reason)
	}
	return response
}

export default validateAddress
