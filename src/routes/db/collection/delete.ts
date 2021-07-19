import type { FastifyPluginAsync } from 'fastify'
import { Collection, Query, ApiKey } from '../../../schema'
import { deleteByQuery } from '../../../db'
import { parseAsObject } from '../../../util'

export const delet_: FastifyPluginAsync = async (fastify) => {
  fastify.delete<{ Params: Collection; Querystring: Query; Headers: ApiKey }>(
    '/',
    { schema: { params: Collection, querystring: Query, headers: ApiKey } },
    async (req, reply) => {
      const { db, collection } = req.params
      const { query: _query, mode } = req.query
      const token = req.headers.authorization
      const apiKey = req.headers['x-api-key']
      const query = _query ? parseAsObject(_query) : {}
      if (query === null) {
        reply.code(400)
        throw new Error('QueryInvalid')
      }
      try {
        const data = await deleteByQuery({ db, collection })({ query, mode, token, apiKey })
        return { statusCode: 200, data }
      } catch (e) {
        reply.code(401)
        throw e
      }
    }
  )
}
