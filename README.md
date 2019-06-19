# test-changelog

### 如何构建一个 git commit lint 及 commit message lint

- 第一步，先引入[`husky`](https://github.com/typicode/husky)包，在`package.json`里面增加

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

原本 git 是提供了 `git hooks` 去帮助开发人员在操作 `git` 的时候检查提交的内容及信息，具体可以[查看git自定义钩子](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)，不过这里我们利用了 `husky` 来更好的去使用

- 第二步，引入 [`lint-staged`](https://github.com/okonet/lint-staged) 来检查你提交文件的前的操作是否规范，并决定检查通过时如何操作这些通过检查的文件, 在 `package.json` 文件中加入如下配置：

```json
{
  "lint-staged": {
    // 目录范围
    "src/**/*.{js, vue}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  },
}
```

- 第三步，引入 [`commitlint`](https://github.com/conventional-changelog/commitlint) 与 [`commitlint-config-cz`](https://github.com/whizark/commitlint-config-cz) 来检查提交的信息是否符合要求，这里可以通过添加 `commitlint.config.js` 到项目根目录

```js
// commitlint.config.js
module.exports = {
  extends: [
  'cz'
  ],
  rules: {
  }
}
```

或者，在 `package.json` 文件中增加如下 `scripts`

```json
{
  "scripts": {
    "cz": "npx git-cz"
  }
}
```

- 第四步，引入 [`cz-customizable`](https://github.com/leonardoanalista/cz-customizable) 来校验你提交的`git-message`是否符合规范

在 `package.json` 文件中增加如下内容：

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
}
```

并且在根目录文件夹下，增加 `.cz-config.js`，[参考cz-config-EXAMPLE.js](https://github.com/leonardoanalista/cz-customizable/blob/master/cz-config-EXAMPLE.js)

```js
// .cz-config.js
'use strict';

module.exports = {
  types: [
    {
      value: 'WIP',
      name : '💪  WIP:      Work in progress'
    },
    {
      value: 'feat',
      name : '✨  feat:     A new feature'
    },
    {
      value: 'fix',
      name : '🐞  fix:      A bug fix'
    },
    {
      value: 'refactor',
      name : '🛠  refactor: A code change that neither fixes a bug nor adds a feature'
    },
    {
      value: 'docs',
      name : '📚  docs:     Documentation only changes'
    },
    {
      value: 'test',
      name : '🏁  test:     Add missing tests or correcting existing tests'
    },
    {
      value: 'chore',
      name : '🗯  chore:    Changes that don\'t modify src or test files. Such as updating build tasks, package manager'
    },
    {
      value: 'style',
      name : '💅  style:    Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'revert',
      name : '⏪  revert:   Revert to a commit'
    }
  ],

  scopes: [],

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"]
};
```

- 第五步，增加 `changelog` 生成的命令：

官方推荐使用 `standard-version`，这里我们提供一个交互式的命令，让用户选择性的去更新版本类型，所以使用了编码的形式去发布 `Changelog`, 具体查看 [genChangelog.js](./scripts/genChangelog.js), 添加以下命令，用于生成 `Changelog`

```json
{
  "scripts": {
    "dump": "node scripts/genChangelog.js"
  }
}
```

> 注： 这里之所以使用了编码的形式去生成 `Changelog`，是因为我们需要去掉默认的头部信息，更新定制化的生成版本号（目前只提供了三个）

~~但也可以使用脚本的形式去自定义生成 `changelog`，[参考 genChangelog.js](https://github.com/vuejs/vue-cli/blob/dev/scripts/genChangelog.js)~~