import * as DynamoDbToolbox from 'dynamodb-toolbox'
import { assertHasRequiredEnvVars } from '@/common/required-env-vars'
import { dynamoDbDocumentClient } from '../utils/dynamodb'
import { EXPENSE_TABLE } from '../config'

assertHasRequiredEnvVars(['EXPENSE_TABLE'])

export const ExpenseTable = new DynamoDbToolbox.Table({
  name: EXPENSE_TABLE,
  partitionKey: 'expenseId',
  DocumentClient: dynamoDbDocumentClient,
  indexes: {
    Created: {
      partitionKey: '_et',
      sortKey: '_ct',
    },
  },
})

const Expense = new DynamoDbToolbox.Entity({
  name: 'Expense',
  attributes: {
    expenseId: {
      partitionKey: true,
    },
    userId: 'string',
    title: 'string',
    ammount: 'number',
    note: 'string',
    category: 'list',
  },
  table: ExpenseTable,
})

export default Expense
