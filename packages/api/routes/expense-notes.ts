import { Router } from 'express'
import asyncify from 'express-asyncify'
import tryParseReq from '../try-parse-req'
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  ListNotesLastEvaluatedKey,
} from '../controllers/note'
import type { Filter } from '@/common/filter'

const noteRouter = asyncify(Router({ mergeParams: true }))

noteRouter.get('/expenses/:expenseId/notes', async (req, res) => {
  const { expenseId } = req.params
  const lastEvaluatedKeyParsed: ListNotesLastEvaluatedKey | undefined = tryParseReq({ req, res, key: 'lastEvaluatedKey' })
  const filterParsed: Filter | undefined = tryParseReq({ req, res, key: 'filter' })
  const notes = await listNotes({
    lastEvaluatedKey: lastEvaluatedKeyParsed,
    filter: filterParsed,
    expenseId,
  })

  res.json(notes)
})

noteRouter.get('/expenses/:expenseId/notes/:noteId', async (req, res) => {
  const { expenseId, noteId } = req.params
  const note = await getNote({
    expenseId,
    noteId,
  })

  if (!note) {
    return res
      .status(404)
      .json({})
  }

  return res.json(note)
})

noteRouter.post('/expenses/:expenseId/notes', async (req, res) => {
  const { note } = req.body
  const { expenseId } = req.params
  const createdNote = await createNote({
    expenseId,
    note,
    currentUserId: req.cognitoUser.userId,
  })

  res.json(createdNote)
})

noteRouter.put('/expenses/:expenseId/notes/:noteId', async (req, res) => {
  const { expenseId, noteId } = req.params
  const { note } = req.body
  const noteItem = await updateNote({
    expenseId,
    noteId,
    note,
  })

  res.json({ data: noteItem })
})

noteRouter.delete('/expenses/:expenseId/notes/:noteId', async (req, res) => {
  const { expenseId, noteId } = req.params
  const result = await deleteNote({
    expenseId,
    noteId,
  })

  if (!result) {
    return res
      .status(404)
      .json({})
  }

  return res.json({})
})

export default noteRouter
