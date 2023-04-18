
import development from './development'
import production from './production'

function getConfig(environment: string) {
    if (environment === 'DEV') {
        return development
    } else if (environment === 'PROD') {
        return production
    } else {
        return development
    }
}
export const config = getConfig(process.env['NODE_ENV'] ?? 'DEV');
