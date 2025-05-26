import os from 'os'
import config from '../configs/config'

interface SystemHealth {
    cpuUsage: number[]
    totalMemory: string
    freeMemory: string
}interface MemoryUsage {
    heapTotal: string
    heapUsed: string
}
interface ApplicationHealth {
    environment: string
    uptime: string
    memoryUsage: MemoryUsage
}

export const getSystemHealth = (): SystemHealth => {
    const totalMemoryMB = (os.totalmem() / (1024 * 1024)).toFixed(2)
    const freeMemoryMB = (os.freemem() / (1024 * 1024)).toFixed(2)

    return {
        cpuUsage: os.loadavg(),
        totalMemory: `${totalMemoryMB} MB`,
        freeMemory: `${freeMemoryMB} MB`
    }
}
export const getApplicationHealth = (): ApplicationHealth => {
    const heapTotalMB = (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2)
    const heapUsedMB = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)

    return {
        environment: config.ENV!,
        uptime: `${process.uptime().toFixed(2)} Seconds`, // More conventional capitalization
        memoryUsage: {
            heapTotal: `${heapTotalMB} MB`,
            heapUsed: `${heapUsedMB} MB`
        }

    }
}