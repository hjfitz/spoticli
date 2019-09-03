import events from 'events'

// there is no better way
const emitter = new events.EventEmitter()

export default emitter
