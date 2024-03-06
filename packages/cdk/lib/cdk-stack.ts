import { Aws, CfnOutput, Stack, StackProps} from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import ExpressApi from './constructs/ExpressApi'
import Auth from './constructs/Auth'
import WebApp from './constructs/WebApp'
import UserTable from './constructs/tables/UserTable'
import ExpenseTable from './constructs/tables/ExpenseTable'
import IncomeTable from './constructs/tables/IncomeTable'
import NoteTable from './constructs/tables/NoteTable'

export default class CuriousCrowdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const userTable = new UserTable(this, 'UserTable')
    const expenseTable = new ExpenseTable(this, 'ExpenseTable')
    const incomeTable = new IncomeTable(this, 'IncomeTable')
    const noteTable = new NoteTable(this, 'NoteTable')
    new WebApp(this, 'WebApp')
    const auth = new Auth(this, 'Auth', {
      userTable: userTable.table,
    })
    new ExpressApi(this, 'ExpressApi', {
      auth,
      userTable: userTable.table,
      expenseTable: expenseTable.table,
      incomeTable: incomeTable.table,
      noteTable: noteTable.table,
    })

    new CfnOutput(this, 'Region', { key: 'Region', value: Aws.REGION })
  }
}