import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'softDelete',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const modelClient = (client as any)[model];

          if (operation === 'delete') {
            return modelClient.update({
              ...args,
              data: { deletedAt: new Date() },
            });
          }

          if (operation === 'deleteMany') {
            return modelClient.updateMany({
              ...args,
              data: { deletedAt: new Date() },
            });
          }

          if (
            ['findUnique', 'findFirst', 'findMany', 'count'].includes(operation)
          ) {
            const extendedArgs = (args || {}) as any;
            extendedArgs.where = { ...extendedArgs.where, deletedAt: null };

            if (operation === 'findUnique') {
              return modelClient.findFirst(extendedArgs);
            }
            
            return query(extendedArgs);
          }

          return query(args);
        },
      },
    },
  });
});
