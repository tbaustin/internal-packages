import _get from 'lodash/get'


export default function applySort(arr, dir, val) {
	return [...arr].sort((a, b) => {
		const aVal = _get(a, val)
		const bVal = _get(b, val)

		// if both vals are numbers we need to use the
		// "numeric" option to sort numbers, otherwise just
		// compare as alphanumeric even if one is a number

		// if the value does not exist push it to the back
		if(dir === `asc`) {
			return bVal
				? `${aVal}`.localeCompare(`${bVal}`, undefined, { numeric: +aVal && +bVal ? true : false })
				: -1

		} else {
			return aVal
				? `${bVal}`.localeCompare(`${aVal}`, undefined, { numeric: +aVal && +bVal ? true : false })
				: 1
		}
	})
}
