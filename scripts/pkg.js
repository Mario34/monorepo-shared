const pacote = require('pacote')
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const root = path.resolve(__dirname, '..')

const getPkgJson = () => {
  return glob.sync(
    "packages/**/package.json",
    { root, ignore: '**/node_modules/**' }
  ).reduce((pre, curr) => {
    pre.push({
      ...require(path.resolve(root, curr)),
      __path__: curr.replace('/package.json', ''),
    })
    return pre
  }, [])
}

const getUnpublishedPkg = async () => {
  const allPkgJson = getPkgJson()
  const pkgs = []
  for (let i = 0; i < allPkgJson.length; i++) {
    const pkg = allPkgJson[i]
    await pacote.packument(pkg.name).then(data => {
      if (!data.versions || !data.versions[pkg.versions]) {
        pkgs.push(pkg)
      }
    }).catch((e) => {
      pkgs.push(pkg)
      console.log(chalk.red(e.message || `get ${pkg.name} error`))
    })
  }
  return pkgs
}

module.exports = {
  getPkgJson,
  getUnpublishedPkg
}
