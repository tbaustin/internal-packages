import { State } from 'statable'
import fetch from './fetch'

const state = new State({}, {
	fetch,
})
export default state