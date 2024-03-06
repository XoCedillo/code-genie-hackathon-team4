import { Construct } from 'constructs'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { CfnOutput } from 'aws-cdk-lib'
import BaseTable from '../BaseTable'

export default class ExpenseTable extends Construct {
  public readonly table: Table

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const baseTable = new BaseTable(this, 'Table', {
      partitionKey: { name: 'expenseId', type: AttributeType.STRING },
    })

    baseTable.table.addGlobalSecondaryIndex({
      indexName: 'Created',
      partitionKey: {
        name: '_et',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: '_ct',
        type: AttributeType.STRING,
      },
    })

    this.table = baseTable.table
    
    new CfnOutput(this, 'ExpenseTable', { key: 'ExpenseTable', value: this.table.tableName })
  }
}