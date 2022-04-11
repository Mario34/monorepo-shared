# Front End Shared

📦 开箱即用的 `monorepo` 项目模版

## 快速开始

### 创建一个新的项目

执行 `node ./scripts/create.js` 或 `pnpm run create:pkg`

输入scope，可选
```
🤔 Input scope(@scope, optional): @scope
```

输入包名称
```
🤔 Enter a new package name: pkg-ame
```

确认创建
```
🤔 Enter create @scope/pkg-ame pkg(y/n): 
```

### changeset add

执行 `pnpm changeset` 添加版本说明，生成版本文件

### changeset version

执行 `pnpm changeset version` 消费版本文件，修改项目版本，生成CHANGELOG

### changeset tag

执行 `pnpm changeset tag` 和 `git push --follow-tags`，创建版本标签并同步到远程

### build

执行 `node ./scripts/build.js` 或 `pnpm run build`，脚本会根据当前版本是否存在于远程仓库，按需打包

## publish

执行 `pnpm changeset publish` 按需发布

## 相关链接

- [changesets](https://github.com/changesets/changesets)
- [pnpm workspaces](https://pnpm.io/workspaces)