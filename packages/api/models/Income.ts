import * as DynamoDbToolbox from 'dynamodb-toolbox'
import { assertHasRequiredEnvVars } from '@/common/required-env-vars'
import { dynamoDbDocumentClient } from '../utils/dynamodb'
import { INCOME_TABLE } from '../config'

assertHasRequiredEnvVars(['INCOME_TABLE'])

export const IncomeTable = new DynamoDbToolbox.Table({
  name: INCOME_TABLE,
  partitionKey: 'incomeId',
  DocumentClient: dynamoDbDocumentClient,
  indexes: {
    Created: {
      partitionKey: '_et',
      sortKey: '_ct',
    },
  },
})

const Income = new DynamoDbToolbox.Entity({
  name: 'Income',
  attributes: {
    incomeId: {
      partitionKey: true,
    },
    userId: 'string',
    title: 'string',
    ammount: 'number',
    description: 'string',
  },
  table: IncomeTable,
})

export default Income
