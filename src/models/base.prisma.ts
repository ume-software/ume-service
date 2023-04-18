import { PrismaClient } from '@prisma/client';


// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
    prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env['NODE_ENV'] === 'development') global.prisma = prisma;



async function softDelete() {
    /***********************************/
    /* SOFT DELETE MIDDLEWARE */
    /***********************************/
    prisma.$use(async (params, next) => {
        // Check incoming query type
        if (params.action == 'count' || params.action.includes('find')) {
            if (params.args == undefined) {
                params.args = {
                    where: {
                        deletedAt: null
                    }
                }
            } else {
                params.args['where'] = { ...params.args['where'], deletedAt: null }
            }
        }
        if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update'
            params.args['data'] = { deletedAt: new Date() }
        }
        if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany'
            if (params.args.data != undefined) {
                params.args.data['deletedAt'] = new Date();
            } else {
                params.args['data'] = { deletedAt: new Date() }
            }
        }

        return next(params)
    })
}

softDelete()
export default prisma;