import { Filter } from '@/common/filter'
import Note from '../models/Note'
import User, { UserTable } from '../models/User'
import { generateId } from '../utils/id'
import { log } from '../utils/logger'
import { dynamoCreateItem, getAttributesWithout } from '../utils/dynamodb'
import { DEFAULT_PAGE_SIZE } from '../../common/pagination'

const READ_ONLY_ATTRIBUTES = [
  'userId',
  'expenseId',
  'noteId',
  'parentId',
]
const IMMUTABLE_ATTRIBUTES = [
  ...READ_ONLY_ATTRIBUTES,
]

export async function createNote({
  note,
  expenseId,
  noteId = note.noteId || generateId(),
  currentUserId,
}) {
  const attributes = getAttributesWithout({ attributes: note, without: READ_ONLY_ATTRIBUTES })
  attributes.expenseId = expenseId
  attributes.noteId = noteId
  attributes.userId = currentUserId

  await dynamoCreateItem({
    entity: Note,
    attributes,
  })

  log.info('NOTE_CONTROLLER:NOTE_CREATED', { attributes })

  return { data: attributes }
}

export async function updateNote({
  expenseId,
  noteId,
  note,
}) {
  const attributes = getAttributesWithout({ attributes: note, without: IMMUTABLE_ATTRIBUTES })
  attributes.expenseId = expenseId
  attributes.noteId = noteId
  const noteItem = await Note.update(attributes, { returnValues: 'ALL_NEW' })

  log.info('NOTE_CONTROLLER:NOTE_UPDATED', { noteItem })

  return noteItem.Attributes
}

export async function getNote({
  expenseId,
  noteId,
}) {
  const note = await Note.get({ expenseId, noteId })
  const noteItem = note?.Item

  if (!noteItem) return null

  const data = noteItem
  const user = noteItem.userId ? await User.get({ userId: noteItem.userId }) : null
  
  // @ts-ignore
  data.user = user?.Item

  return { data }
}

export interface ListNotesLastEvaluatedKey {
  expenseId: string
}

interface ListNotesParams {
  lastEvaluatedKey?: ListNotesLastEvaluatedKey
  filter?: Filter
  expenseId: string
}

export async function listNotes({
  lastEvaluatedKey,
  filter,
  expenseId,
}: ListNotesParams) {
  const noteQueryResponse = await Note.query(expenseId, { limit: DEFAULT_PAGE_SIZE, startKey: lastEvaluatedKey })
  const noteQueryResponseItems = noteQueryResponse?.Items || []
  const notesUserIds = noteQueryResponseItems.map(note => note.userId).filter(Boolean)

  if (!notesUserIds.length) {
    return {
      data: noteQueryResponseItems,
      lastEvaluatedKey: noteQueryResponse.LastEvaluatedKey,
    }
  }

  const uniqueNotesUserIds = Array.from(new Set(notesUserIds))
  const notesUsersBatchGetOperations = uniqueNotesUserIds.map(noteUserId => User.getBatch({ userId: noteUserId }))

  const notesUsers = notesUsersBatchGetOperations.length ? await UserTable.batchGet(notesUsersBatchGetOperations) : null

  const notes = noteQueryResponseItems.map(note => {
    const user = note.userId ? notesUsers?.Responses[UserTable.name].find(noteUser => noteUser.userId === note.userId) : null

    return {
      ...note,
      user,
    }
  })

  return {
    data: notes,
    lastEvaluatedKey: noteQueryResponse.LastEvaluatedKey,
  }
}

export async function deleteNote({
  expenseId,
  noteId,
}) {
  const itemToDeleteKey = { expenseId, noteId }

  const note = await Note.get(itemToDeleteKey)

  if (!note) return null

  return Note.delete(itemToDeleteKey)
}
