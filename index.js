const dataToQueryString = obj => {
	let arr = []
	for (let key in obj) arr.push(encodeURIComponent(key) + '=' + JSON.stringify(obj[key]))
	return arr.join("&")
}

const queryStringToData = string => {
	let data = {}
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

const getUrlParams = () => window.location.search

const getDataFromUrl = () => queryStringToData(getUrlParams()) ?? {}

const createUrl = string => 
	window.location.origin
		+ window.location.pathname 
		+ '?' 
		+ string

const removeEmpty = obj => (
	Object.entries(obj).forEach(([key, val]) =>
		val && typeof val === 'object' 
			? !(Object.keys(val)?.length ?? val.length) ? delete obj[key] : removeEmpty(val)
			: val == null && delete obj[key]
	), obj)

const setObjToUrl = data => {
	let updatedData = { ...getDataFromUrl(), ...data }
	const url = createUrl(
		dataToQueryString(removeEmpty(updatedData))
	)
	window.history.pushState({ path: url }, '', url)
}

const getButSetIfEmpty = ({ key, defaultValue }) =>
	getDataFromUrl()[key] ?? (
		setObjToUrl({ [key]: defaultValue }),
		getDataFromUrl()[key]
	)

const removeAllParams = () => window.history.pushState( {}, '', window.location.origin )

const urlStore = {
	get: getButSetIfEmpty,
	set: setObjToUrl,
	clear: removeAllParams,
}

export default urlStore

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