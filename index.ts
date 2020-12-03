interface Data {
    [key: string]: string
}


const dataToQueryString = (data: Data): string => {
    let strings: string[] = []
	
	Object.keys(data).forEach((key: string) => strings.push(encodeURIComponent(key) + '=' + JSON.stringify(data[key])))
	
	return strings.join("&")
}




const queryStringToData = (string: string): Data => {
	let data: Data = {}
	string = decodeURIComponent(string)
	let arr = string.split('&')
	arr[0] = arr[0].substring(1)
	
	if(!string) return data
	arr.forEach(element => {
		let attributes = element.split('=')
		
		data[attributes[0]] = JSON.parse(attributes[1])
	})
	return data
}



const getUrlParams = (): string => window.location.search




const getDataFromUrl = (): Data => queryStringToData(getUrlParams()) ?? {}




const createUrl = (params: string) => 
	window.location.origin
		+ window.location.pathname 
		+ '?' 
		+ params




const removeEmpty = (obj: Data): Data => (
	Object.entries(obj).forEach(([key, val]: Array<any>) =>
		val && typeof val === 'object' 
			? !(Object.keys(val)?.length ?? val.length) ? delete obj[key] : removeEmpty(val)
			: val == null && delete obj[key]
	), obj)




const setObjToUrl = (data: Data): void => {
	let updatedData = { ...getDataFromUrl(), ...data }
	const url = createUrl(
		dataToQueryString(removeEmpty(updatedData))
	)
	window.history.pushState({ path: url }, '', url)
}





const getButSetIfEmpty = ({ key, defaultValue }: { key: string, defaultValue: any }): Data | string =>
	getDataFromUrl()[key] ?? (
		setObjToUrl({ [key]: defaultValue }),
		getDataFromUrl()[key]
	)





const removeAllParams = (): void => window.history.pushState( {}, '', window.location.origin )




const urlStore = {
	get: getButSetIfEmpty,
	set: setObjToUrl,
	clear: removeAllParams,
}
/*
const dataToQueryString = (obj, prefix) => {
	let arr = [], key, value;

	const serialize = () => {
		key = prefix ? prefix + "[" + p + "]" : p
		
		value = (obj[p] !== null && typeof obj[p] === "object") 
			? dataToQueryString(obj[p], key) 
			: encodeURIComponent(key) + "=" + encodeURIComponent(obj[p])

		return value
	}

	for (p in obj) arr.push(serialize(p))

	return arr.join("&")
}
*/
