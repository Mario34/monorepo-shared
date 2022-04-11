const readline = require('readline')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const main = async () => {
  console.clear()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  let scope = ''
  let name = ''
  let fullName = ''
  await new Promise(resolve => {
    rl.question(chalk.yellow.bold('🤔 Input scope(@scope, optional): '), (answer) => {
      scope = answer.trim()
      console.clear()
      resolve()
    });
  })

  const inputName = async () => {
    return new Promise(resolve => {
      rl.question(chalk.yellow.bold('🤔 Enter a new package name: '), async (answer) => {
        name = answer.trim()
        if (name) {
          resolve()
          console.clear()
        } else {
          console.log(chalk.red.bold('🤔 Please enter a valid package name'))
          await inputName()
          resolve()
        }
      });
    })
  }

  await inputName()

  fullName = path.join(scope, name)

  
  await new Promise(resolve => {
    rl.question(chalk.yellow.bold(`🤔 Enter create ${fullName} pkg(y/n): `), (answer) => {
      const res = answer.trim()
      if (res === 'y') {
        resolve()
        console.clear()
      } else {
        process.exit()
      }
    });
  })

  const pkgDir = path.resolve(__dirname, `../packages/${name}`)
  fs.mkdirSync(pkgDir)
  fs.writeFileSync(`${pkgDir}/package.json`, JSON.stringify(
    {
      "name": fullName,
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
    },
    null,
    2
  ))
  console.log(chalk.green.bold(`🤔 ${fullName} created!`))

  rl.close()
}

main()