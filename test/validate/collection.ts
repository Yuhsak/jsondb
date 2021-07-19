import tap from 'tap'
import type { HTTPMethods } from 'fastify'
import { build } from '../../src/server'
import { invalidCollections } from '../../src/hooks'

const server = build()

invalidCollections.forEach((collection) =>
  (['GET', 'POST'] as HTTPMethods[]).forEach((method) => {
    tap.test(`${method} /:db/${collection} responds with 404`, async (t) => {
      const res = await server.inject({
        method,
        path: `/db/${collection}`,
      })
      t.equal(res.statusCode, 404)
      t.equal(JSON.parse(res.body).message, 'CollectionNotFound')
    })
  })
)

invalidCollections.forEach((collection) =>
  (['GET', 'PUT', 'PATCH', 'DELETE'] as HTTPMethods[]).forEach((method) => {
    tap.test(`${method} /:db/${collection}/:id responds with 404`, async (t) => {
      const res = await server.inject({
        method,
        path: `/db/${collection}/ffffffffffffffffffffffff`,
      })
      t.equal(res.statusCode, 404)
      t.equal(JSON.parse(res.body).message, 'CollectionNotFound')
    })
  })
)
