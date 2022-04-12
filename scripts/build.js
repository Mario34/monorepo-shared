const rollup = require('rollup')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const typescript = require('rollup-plugin-typescript2');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

const root = path.resolve(__dirname, '..')
const { getUnpublishedPkg } = require('./pkg')

const build = async (pkg) => {
  const pkgDir = pkg.__path__

  // clean up
  await fs.remove(path.resolve(pkgDir, 'dist'))

  // rollup build
  const bundle = await rollup.rollup({
    input: path.resolve(pkgDir, 'src/index.ts'),
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      typescript({
        clean: true,
        check: false, // FIXED: https://github.com/ezolenko/rollup-plugin-typescript2/issues/234
        tsconfig: path.resolve(root, 'tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            rootDir: path.resolve(pkgDir),
          },
          include: [
            path.resolve(pkgDir),
          ]
        }
      })
    ],
  })
  // module
  await bundle.write({
    output: {
      file: path.resolve(pkgDir, pkg.module),
      format: 'esm',
    },
  });
  // main
  await bundle.write({
    output: {
      file: path.resolve(pkgDir, pkg.main),
      format: 'cjs',
      exports: 'named'
    },
  });

  // generate index.d.ts
  const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
  const extractorConfig =
    ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true
  })
  if (extractorResult.succeeded) {
    console.log(
      chalk.bold(chalk.green(`API Extractor completed successfully.`))
    )
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
      ` and ${extractorResult.warningCount} warnings`
    )
    process.exitCode = 1
  }

  await fs.remove(path.resolve(pkgDir, 'dist/src'))
}

const main = async () => {
  const pkgs = await (await getUnpublishedPkg()).filter(pkg => pkg.buildConfig && pkg.buildConfig.build)
  if (!pkgs.length) {
    console.log(chalk.bold(chalk.red('No unpublished packages found')))
    return
  }

  console.log(chalk.bold(chalk.yellowBright(`${pkgs.length} packages to build`)))

  for (let i = 0; i < pkgs.length; i++) {
    const pkg = pkgs[i]
    console.log(
      chalk.bold(chalk.blue(`[${i + 1}/${pkgs.length}] ${pkg.name}@${pkg.version} building...`))
    )
    await build(pkg)
    console.log(
      chalk.bold(chalk.green(`${pkg.name}@${pkg.version} built successfully. \n`))
    )
  }
}

main()