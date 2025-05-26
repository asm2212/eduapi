import util from 'util'
import { createLogger, format, transports } from 'winston'
import { ConsoleTransportInstance } from 'winston/lib/winston/transports'
import config from '../configs/config'
import { EApplicationEnvironment } from '../constants/application'

const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info
    const customLevel = level.toUpperCase()
    const customTimestamp = timestamp as string
    const customMessage = message as string
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })

    const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\n${customMeta}\n`
    return customLog
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {

    if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat)
            })
        ]
    }

    return []
}

export default createLogger({

    defaultMeta: {
        meta: {}
    },
    transports: [...consoleTransport()]
})