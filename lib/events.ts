import events from 'events'

// there must be a better way
const emitter = new events.EventEmitter()

export default emitter
