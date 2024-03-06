import { Router } from 'express'
import asyncify from 'express-asyncify'
import tryParseReq from '../try-parse-req'
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  ListExpensesLastEvaluatedKey,
} from '../controllers/expense'
import type { Filter } from '@/common/filter'

const expenseRouter = asyncify(Router({ mergeParams: true }))

expenseRouter.get('/expenses', async (req, res) => {
  const lastEvaluatedKeyParsed: ListExpensesLastEvaluatedKey | undefined = tryParseReq({ req, res, key: 'lastEvaluatedKey' })
  const filterParsed: Filter | undefined = tryParseReq({ req, res, key: 'filter' })
  const expenses = await listExpenses({
    lastEvaluatedKey: lastEvaluatedKeyParsed,
    filter: filterParsed,
  })

  res.json(expenses)
})

expenseRouter.get('/expenses/:expenseId', async (req, res) => {
  const { expenseId } = req.params
  const expense = await getExpense({
    expenseId,
  })

  if (!expense) {
    return res
      .status(404)
      .json({})
  }

  return res.json(expense)
})

expenseRouter.post('/expenses', async (req, res) => {
  const { expense } = req.body
  const createdExpense = await createExpense({
    expense,
    currentUserId: req.cognitoUser.userId,
  })

  res.json(createdExpense)
})

expenseRouter.put('/expenses/:expenseId', async (req, res) => {
  const { expenseId } = req.params
  const { expense } = req.body
  const expenseItem = await updateExpense({
    expenseId,
    expense,
  })

  res.json({ data: expenseItem })
})

expenseRouter.delete('/expenses/:expenseId', async (req, res) => {
  const { expenseId } = req.params
  const result = await deleteExpense({
    expenseId,
  })

  if (!result) {
    return res
      .status(404)
      .json({})
  }

  return res.json({})
})

export default expenseRouter
