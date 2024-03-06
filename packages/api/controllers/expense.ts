import { Filter } from '@/common/filter'
import Expense from '../models/Expense'
import User, { UserTable } from '../models/User'
import { generateId } from '../utils/id'
import { log } from '../utils/logger'
import { dynamoCreateItem, getAttributesWithout, scanAll } from '../utils/dynamodb'
import { DEFAULT_PAGE_SIZE } from '../../common/pagination'

const READ_ONLY_ATTRIBUTES = [
  'expenseId',
  'userId',
]
const IMMUTABLE_ATTRIBUTES = [
  ...READ_ONLY_ATTRIBUTES,
]

export async function createExpense({
  expense,
  expenseId = generateId(),
  currentUserId,
}) {
  const attributes = getAttributesWithout({ attributes: expense, without: READ_ONLY_ATTRIBUTES })
  attributes.expenseId = expenseId
  attributes.userId = currentUserId

  await dynamoCreateItem({
    entity: Expense,
    attributes,
  })

  log.info('EXPENSE_CONTROLLER:EXPENSE_CREATED', { attributes })

  return { data: attributes }
}

export async function updateExpense({
  expenseId,
  expense,
}) {
  const attributes = getAttributesWithout({ attributes: expense, without: IMMUTABLE_ATTRIBUTES })
  attributes.expenseId = expenseId
  const expenseItem = await Expense.update(attributes, { returnValues: 'ALL_NEW' })

  log.info('EXPENSE_CONTROLLER:EXPENSE_UPDATED', { expenseItem })

  return expenseItem.Attributes
}

export async function getExpense({
  expenseId,
}) {
  const expense = await Expense.get({ expenseId })
  const expenseItem = expense?.Item

  if (!expenseItem) return null

  const data = expenseItem
  const user = expenseItem.userId ? await User.get({ userId: expenseItem.userId }) : null
  
  // @ts-ignore
  data.user = user?.Item

  return { data }
}

export interface ListExpensesLastEvaluatedKey {
  expenseId: string
}

interface ListExpensesParams {
  lastEvaluatedKey?: ListExpensesLastEvaluatedKey
  filter?: Filter
  index?: string
}

export async function listExpenses({
  lastEvaluatedKey,
  filter,
  index,
}: ListExpensesParams = {}) {
  const expenseScanResponse = index ?
    await Expense.query('Expense', { limit: DEFAULT_PAGE_SIZE, startKey: lastEvaluatedKey, reverse: true, index })
    : await scanAll({
      entity: Expense,
      scanOptions: {
        startKey: lastEvaluatedKey,
        index,
      },
      maxItems: DEFAULT_PAGE_SIZE,
      maxPages: 10,
      filter,
    })
  const expenseScanResponseItems = expenseScanResponse?.Items || []
  const expensesUserIds = expenseScanResponseItems.map(expense => expense.userId).filter(Boolean)

  if (!expensesUserIds.length) {
    return {
      data: expenseScanResponseItems,
      lastEvaluatedKey: expenseScanResponse.LastEvaluatedKey,
    }
  }

  const uniqueExpensesUserIds = Array.from(new Set(expensesUserIds))
  const expensesUsersBatchGetOperations = uniqueExpensesUserIds.map(expenseUserId => User.getBatch({ userId: expenseUserId }))

  const expensesUsers = expensesUsersBatchGetOperations.length ? await UserTable.batchGet(expensesUsersBatchGetOperations) : null

  const expenses = expenseScanResponseItems.map(expense => {
    const user = expense.userId ? expensesUsers?.Responses[UserTable.name].find(expenseUser => expenseUser.userId === expense.userId) : null

    return {
      ...expense,
      user,
    }
  })

  return {
    data: expenses,
    lastEvaluatedKey: expenseScanResponse.LastEvaluatedKey,
  }
}

export async function deleteExpense({
  expenseId,
}) {
  const itemToDeleteKey = { expenseId }

  const expense = await Expense.get(itemToDeleteKey)

  if (!expense) return null

  return Expense.delete(itemToDeleteKey)
}
