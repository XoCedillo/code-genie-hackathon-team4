import { Construct } from 'constructs'
import { App, RedirectStatus } from '@aws-cdk/aws-amplify-alpha'
import { CfnOutput } from 'aws-cdk-lib'
import { Asset } from 'aws-cdk-lib/aws-s3-assets'
import * as path from 'path'
import { execSync } from 'child_process'
import { getEnvironmentConfig, getEnvironmentName } from '../environment-config'
import { getMissingEnvVars, getMissingEnvVarsMessage } from '../../../common/required-env-vars'
import { configDotenv } from 'dotenv'

export default class WebApp extends Construct {
  readonly amplifyApp: App
  readonly amplifyUrl: string
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const envName = getEnvironmentName(this.node)
    const amplifyApp = new App(this, 'AmplifyApp', {
      appName: `Curious Crowd ${envName}`,
      customRules: [
        {
          source: '/getting-started',
          target: '/getting-started',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/account',
          target: '/account',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/users',
          target: '/users',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/users/<userId>',
          target: '/users/[userId]',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/expenses',
          target: '/expenses',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/expenses/<expenseId>',
          target: '/expenses/[expenseId]',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/incomes',
          target: '/incomes',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '/incomes/<incomeId>',
          target: '/incomes/[incomeId]',
          status: RedirectStatus.REWRITE,
        },
        {
          source: '</^[^.]+$|\\.(?!(css|gif|ico|jpg|webp|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>',
          target: '/index',
          status: RedirectStatus.REWRITE,
        },
      ],
    })

    const packagedWebAppAsset = this.packageWebApp()
    const branch = amplifyApp.addBranch(envName, {
      asset: packagedWebAppAsset,
      autoBuild: false,
    })
    const environmentConfig = getEnvironmentConfig(this.node)
    const { domainName } = environmentConfig.ui || {}

    if (domainName) {
      const domain = amplifyApp.addDomain(domainName)
      domain.mapRoot(branch)
    }

    this.amplifyApp = amplifyApp
    this.amplifyUrl = `https://${envName}.${amplifyApp.defaultDomain}`

    new CfnOutput(this, 'AmplifyUrl', { key: 'AmplifyUrl', value: this.amplifyUrl })
  }

  packageWebApp() {
    const skipDeployWebApp = this.node.tryGetContext('skipDeployWebApp')

    if (skipDeployWebApp) {
      console.info('Skipping WebApp deploy')
      // This results in the nested stack that Amplify creates for deploying assets being deleted, and
      // needs to be recreated again the next time cdk deploy is run with deploy web app, resulting in
      // a longer stack update time.
      return
    }

    const envName = getEnvironmentName(this.node)
    const uiPackagePath = path.resolve(__dirname, '../../../ui')
    const uiDotEnvPath = path.join(uiPackagePath, `.env/.env.${envName}`)
    configDotenv({ path: uiDotEnvPath })
    const REQUIRED_ENV_VARS = [
      'NEXT_PUBLIC_ApiEndpoint',
      'NEXT_PUBLIC_CognitoUserPoolId',
      'NEXT_PUBLIC_CognitoUserPoolClientId',
      'NEXT_PUBLIC_Region',
    ]
    const missingEnvVars = getMissingEnvVars(REQUIRED_ENV_VARS)

    if (missingEnvVars.length) {
      console.info(getMissingEnvVarsMessage(missingEnvVars))
      console.info(`Skipping web app deploy due to missing environment variables. If you're missing the packages/ui/.env/.env.${envName} file, try running \`npm run copy-outputs-to-dotenv:dev\` to copy values from cdk-outputs.${envName} to the .env file. If the cdk-outputs file also doesn't exist, first run \`npm run pull-stack-outputs:${envName}\`. Then, run \`npm run deploy:${envName}\` again to deploy the web app.`)
      return
    }
    execSync(`npm run build:${envName}`, {
      cwd: uiPackagePath,
      env: {
        ...process.env,
      },
      stdio: 'inherit',
    })

    // TODO: Consider Asset bundling https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3_assets-readme.html#asset-bundling
    return new Asset(this, 'PackagedAsset', {
      path: path.join(uiPackagePath, 'out'),
    })
  }
}