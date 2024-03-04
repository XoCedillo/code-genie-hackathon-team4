# Curious Crowd Initial Setup

## Prerequisites

### Brew

In this demonstration we will use [brew](https://brew.sh/) as the package manager to install required applications.

```shell
# run this command to install brew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Node.js

`Code Genie` requires Node.js v20.0 or newer, so we will explore 2 options to install it

1. Install only this version of node on your machine.

```shell
brew install node@20
```

2. Install through [nvm](https://github.com/nvm-sh/nvm) (allows you to quickly install and use different versions of node via the command line)

a. Run

```shell
brew install nvm
```

b. After installation it will prompt you to add some lines to your `~/.bashrc`, `~/.profile`, or `~/.zshrc` file. Follow those instructions. The lines look like:

```shell
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

c. Install the required node version

```shell
nvm install 20
```

d. Start using said version

```shell
nvm use 20
```

_**Note:** node installations include `npm` and `npx` utilities, which we will use later_

### AWS CLI

1. Install the command line tool

```shell
brew install awscli
```

2. Generate the access keys to configure AWS CLI

a. Go to AWS Console and head to the IAM section

![search IAM](/img/console_search_iam.png)

b. Go to `Users` and create a new one with the appropriate permisions

![create user](/img/create_user.png)

c. After finishing the creation, click on the user name and create an access key with an use case of command line interface. Take note of the values generated, as you will not be able to get them again in the future and they are needed to configure the access of your terminal
![generate access key](/img/access_key.png)

3. Run the following command, and use the values you got from the previous step with their corresponding prompt

```shell
aws configure
```

example output:

```
aws configure
AWS Access Key ID [None]: YOUR_ACCESS_KEY
AWS Secret Access Key [None]: YOUR_SECRET_KEY
Default region name [None]: us-west-2
Default output format [None]:
```

## Now, for the actual work...

You may have noticed the folder `.codegenie` in this repo, it contains the definition of the data models that Code Genie will use to generate the code for the application.

1. Create a new folder (outside of this repo, as you will have to create your own) with the name of your project

2. Copy the folder `.codegenie` and its content to your new folder.

3. Open a new terminal tab and `cd` to your project.

4. Run

```shell
npx @codegenie/cli generate
```

This command is the one that will trigger the code generation.

5. Please take a few minutes to initialize a git repo, commit the generated files, and push it to a repo on github.

6. Install dependencies and create resources in AWS by running:

```shell
npm run init:dev
```

This will give you a list of all resources created and give you a url for your newly deployed app.

7. Take a moment to explore the features the app has and get familiar with the generated code.

8. For local development, run the following commands in separate terminals

```shell
npm run start-ui-local-api:dev

# on a separate terminal
npm run start-api:dev
```

then check `localhost:3001`

9. When you are happy with the changes, just run

```shell
npm run deploy:dev
```
to deploy your changes to dev environment
