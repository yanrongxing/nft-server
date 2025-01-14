import { ILoggerComponent } from '@well-known-components/interfaces'
import fetch from 'node-fetch'
import { ISubgraphComponent } from './types'
import { sleep } from './utils'
import { IRequestSessionComponent } from '../requestSession/types'

export function createSubgraphComponent(
  url: string,
  logger: ILoggerComponent.ILogger,
  requestSession: IRequestSessionComponent
): ISubgraphComponent {
  async function executeQuery<T>(
    query: string,
    variables: Record<
      string,
      string[] | string | number | boolean | undefined
    > = {},
    remainingAttempts = 3,
    requestId = requestSession.getId()
  ): Promise<T> {
    console.log('query',query)
    console.log('variables',variables)
    const start = Date.now()
    const log = (result: 'SUCCESS' | 'FAILURE') => {
      logger.info('Subgraph Query', {
        id: requestId,
        url,
        result,
        time: Date.now() - start,
        remainingAttempts,
      })
    }

    try {
      const response = await fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch subgraph: ${await response.text()}`)
      }

      const result: {
        data: T
        errors?: { message: string }[]
      } = await response.json()
      console.log('result',JSON.stringify(result))
      if (!result || !result.data || Object.keys(result.data).length === 0) {
        if (result && result.errors && result.errors.length) {
          throw new Error(
            `${
              result.errors.length > 1
                ? `There was a total of ${result.errors.length} GraphQL errors, the first one was:`
                : `GraphQL Error:`
            } ${result.errors[0].message}`
          )
        } else {
          throw new Error('GraphQL Error: Invalid response')
        }
      }

      log('SUCCESS')

      return result.data
    } catch (error) {
      log('FAILURE')

      if (remainingAttempts > 0) {
        // retry
        await sleep(500)
        return executeQuery<T>(query, variables, remainingAttempts - 1, requestId)
      } else {
        throw error // bubble up
      }
    }
  }

  return {
    query: executeQuery,
  }
}
