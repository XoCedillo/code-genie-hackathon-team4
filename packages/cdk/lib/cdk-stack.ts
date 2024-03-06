import { Aws, CfnOutput, Stack, StackProps} from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import ExpressApi from './constructs/ExpressApi'
import Auth from './constructs/Auth'
import WebApp from './constructs/WebApp'
import UserTable from './constructs/tables/UserTable'
import PostTable from './constructs/tables/PostTable'
import CommentTable from './constructs/tables/CommentTable'
import ExpenseTable from './constructs/tables/ExpenseTable'
import NoteTable from './constructs/tables/NoteTable'

export default class CuriousCrowdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const userTable = new UserTable(this, 'UserTable')
    const postTable = new PostTable(this, 'PostTable')
    const commentTable = new CommentTable(this, 'CommentTable')
    const expenseTable = new ExpenseTable(this, 'ExpenseTable')
    const noteTable = new NoteTable(this, 'NoteTable')
    new WebApp(this, 'WebApp')
    const auth = new Auth(this, 'Auth', {
      userTable: userTable.table,
    })
    new ExpressApi(this, 'ExpressApi', {
      auth,
      userTable: userTable.table,
      postTable: postTable.table,
      commentTable: commentTable.table,
      expenseTable: expenseTable.table,
      noteTable: noteTable.table,
    })

    new CfnOutput(this, 'Region', { key: 'Region', value: Aws.REGION })
  }
}