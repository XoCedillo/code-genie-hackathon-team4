import { Filter } from '@/common/filter'
import Income from '../models/Income'
import User, { UserTable } from '../models/User'
import { generateId } from '../utils/id'
import { log } from '../utils/logger'
import { dynamoCreateItem, getAttributesWithout, scanAll } from '../utils/dynamodb'
import { DEFAULT_PAGE_SIZE } from '../../common/pagination'

const READ_ONLY_ATTRIBUTES = [
  'incomeId',
  'userId',
]
const IMMUTABLE_ATTRIBUTES = [
  ...READ_ONLY_ATTRIBUTES,
]

export async function createIncome({
  income,
  incomeId = generateId(),
  currentUserId,
}) {
  const attributes = getAttributesWithout({ attributes: income, without: READ_ONLY_ATTRIBUTES })
  attributes.incomeId = incomeId
  attributes.userId = currentUserId

  await dynamoCreateItem({
    entity: Income,
    attributes,
  })

  log.info('INCOME_CONTROLLER:INCOME_CREATED', { attributes })

  return { data: attributes }
}

export async function updateIncome({
  incomeId,
  income,
}) {
  const attributes = getAttributesWithout({ attributes: income, without: IMMUTABLE_ATTRIBUTES })
  attributes.incomeId = incomeId
  const incomeItem = await Income.update(attributes, { returnValues: 'ALL_NEW' })

  log.info('INCOME_CONTROLLER:INCOME_UPDATED', { incomeItem })

  return incomeItem.Attributes
}

export async function getIncome({
  incomeId,
}) {
  const income = await Income.get({ incomeId })
  const incomeItem = income?.Item

  if (!incomeItem) return null

  const data = incomeItem
  const user = incomeItem.userId ? await User.get({ userId: incomeItem.userId }) : null
  
  // @ts-ignore
  data.user = user?.Item

  return { data }
}

export interface ListIncomesLastEvaluatedKey {
  incomeId: string
}

interface ListIncomesParams {
  lastEvaluatedKey?: ListIncomesLastEvaluatedKey
  filter?: Filter
  index?: string
}

export async function listIncomes({
  lastEvaluatedKey,
  filter,
  index,
}: ListIncomesParams = {}) {
  const incomeScanResponse = index ?
    await Income.query('Income', { limit: DEFAULT_PAGE_SIZE, startKey: lastEvaluatedKey, reverse: true, index })
    : await scanAll({
      entity: Income,
      scanOptions: {
        startKey: lastEvaluatedKey,
        index,
      },
      maxItems: DEFAULT_PAGE_SIZE,
      maxPages: 10,
      filter,
    })
  const incomeScanResponseItems = incomeScanResponse?.Items || []
  const incomesUserIds = incomeScanResponseItems.map(income => income.userId).filter(Boolean)

  if (!incomesUserIds.length) {
    return {
      data: incomeScanResponseItems,
      lastEvaluatedKey: incomeScanResponse.LastEvaluatedKey,
    }
  }

  const uniqueIncomesUserIds = Array.from(new Set(incomesUserIds))
  const incomesUsersBatchGetOperations = uniqueIncomesUserIds.map(incomeUserId => User.getBatch({ userId: incomeUserId }))

  const incomesUsers = incomesUsersBatchGetOperations.length ? await UserTable.batchGet(incomesUsersBatchGetOperations) : null

  const incomes = incomeScanResponseItems.map(income => {
    const user = income.userId ? incomesUsers?.Responses[UserTable.name].find(incomeUser => incomeUser.userId === income.userId) : null

    return {
      ...income,
      user,
    }
  })

  return {
    data: incomes,
    lastEvaluatedKey: incomeScanResponse.LastEvaluatedKey,
  }
}

export async function deleteIncome({
  incomeId,
}) {
  const itemToDeleteKey = { incomeId }

  const income = await Income.get(itemToDeleteKey)

  if (!income) return null

  return Income.delete(itemToDeleteKey)
}
