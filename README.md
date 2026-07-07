# yeizi-skills

命令行工具项目用于把远端 [yeizi-skills](https://github.com/chungeplus/yeizi-skills) 仓库中的技能同步到本地 AI 工具的技能目录。

```bash
npx yeizi-skills
```

## 支持平台

| 平台     | 技能目录               |
| ------ | ------------------ |
| codex  | `~/.codex/skills`  |
| claude | `~/.claude/skills` |
| trae   | `~/.trae/skills`   |

## 使用前提

- 已安装 Node.js `>= 20`
- 当前网络可以访问 GitHub（CLI 会从 GitHub 下载仓库快照）

## 30 秒快上手

不带子命令直接执行，会显示帮助信息：

```bash
npx yeizi-skills
```

查看本地已添加技能列表：

```bash
npx yeizi-skills list
```

添加指定技能（运行时会交互提示选择平台）：

```bash
npx yeizi-skills add --skill yeizi-auto-self-review
```

## 命令参考

### `npx yeizi-skills`

不带子命令执行时，打印默认帮助信息。

### `npx yeizi-skills list`

查看本地已添加技能列表，并显示每个技能已添加到哪些平台。

参数：当前无显式参数，也不会交互提示选择平台。

### `npx yeizi-skills add`

把指定技能从远端仓库复制到所选平台的技能目录。

| 选项        | 说明        | 是否必填           |
| --------- | --------- | -------------- |
| `--skill` | 技能列表，逗号分隔 | 否（缺省时交互提示选择技能） |

运行时会交互提示选择添加平台。

## 许可证

MIT
