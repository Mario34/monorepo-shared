const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const { getPkgJson } = require('./pkg')

const main = async () => {
  const allPkg = getPkgJson()
  for (let i = 0; i < allPkg.length; i++) {
    const pkgDir = allPkg[i].__path__
    const pkgName = allPkg[i].name
    await fs.remove(path.resolve(pkgDir, 'dist'))
    console.log(chalk.yellow(`[${pkgName}] ${pkgDir}/dist cleaned.`))
  }
}

main()