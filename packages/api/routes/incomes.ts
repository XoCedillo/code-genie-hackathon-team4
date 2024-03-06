import { Router } from 'express'
import asyncify from 'express-asyncify'
import tryParseReq from '../try-parse-req'
import {
  listIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  ListIncomesLastEvaluatedKey,
} from '../controllers/income'
import type { Filter } from '@/common/filter'

const incomeRouter = asyncify(Router({ mergeParams: true }))

incomeRouter.get('/incomes', async (req, res) => {
  const lastEvaluatedKeyParsed: ListIncomesLastEvaluatedKey | undefined = tryParseReq({ req, res, key: 'lastEvaluatedKey' })
  const filterParsed: Filter | undefined = tryParseReq({ req, res, key: 'filter' })
  const incomes = await listIncomes({
    lastEvaluatedKey: lastEvaluatedKeyParsed,
    filter: filterParsed,
  })

  res.json(incomes)
})

incomeRouter.get('/incomes/:incomeId', async (req, res) => {
  const { incomeId } = req.params
  const income = await getIncome({
    incomeId,
  })

  if (!income) {
    return res
      .status(404)
      .json({})
  }

  return res.json(income)
})

incomeRouter.post('/incomes', async (req, res) => {
  const { income } = req.body
  const createdIncome = await createIncome({
    income,
    currentUserId: req.cognitoUser.userId,
  })

  res.json(createdIncome)
})

incomeRouter.put('/incomes/:incomeId', async (req, res) => {
  const { incomeId } = req.params
  const { income } = req.body
  const incomeItem = await updateIncome({
    incomeId,
    income,
  })

  res.json({ data: incomeItem })
})

incomeRouter.delete('/incomes/:incomeId', async (req, res) => {
  const { incomeId } = req.params
  const result = await deleteIncome({
    incomeId,
  })

  if (!result) {
    return res
      .status(404)
      .json({})
  }

  return res.json({})
})

export default incomeRouter
