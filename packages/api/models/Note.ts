import * as DynamoDbToolbox from 'dynamodb-toolbox'
import { assertHasRequiredEnvVars } from '@/common/required-env-vars'
import { dynamoDbDocumentClient } from '../utils/dynamodb'
import { NOTE_TABLE } from '../config'

assertHasRequiredEnvVars(['NOTE_TABLE'])

export const NoteTable = new DynamoDbToolbox.Table({
  name: NOTE_TABLE,
  partitionKey: 'expenseId',
  sortKey: 'noteId',
  DocumentClient: dynamoDbDocumentClient,
})

const Note = new DynamoDbToolbox.Entity({
  name: 'Note',
  attributes: {
    expenseId: {
      partitionKey: true,
    },
    noteId: {
      sortKey: true,
    },
    userId: 'string',
    comment: 'string',
    parentId: 'string',
  },
  table: NoteTable,
})

export default Note
