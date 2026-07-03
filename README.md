# yeizi-skills

命令行工具，把远端 `yeizi-skills` 仓库中的技能同步到本地 AI 工具的技能目录。

## 支持平台

| 平台    | 技能目录                  |
| ------- | ------------------------- |
| codex   | `~/.codex/skills`         |
| claude  | `~/.claude/skills`        |
| trae    | `~/.trae/skills`          |

## 使用前提

- 已安装 Node.js `>= 20`
- 当前网络可以访问 GitHub（CLI 会用 git 协议拉取仓库快照）

## 30 秒快上手

不带子命令直接执行，会显示帮助信息：

```bash
npx yeizi-skills
```

查看所选平台上的技能（不传参数时 CLI 会交互提示选平台）：

```bash
npx yeizi-skills list
```

为指定平台安装技能（不传平台时同样会交互提示）：

```bash
npx yeizi-skills install --skill yeizi-auto-self-review
```

## 命令参考

### `npx yeizi-skills`

不带子命令执行时，打印默认帮助信息。

### `npx yeizi-skills list`

查看所选平台上每个技能的本地与远端对照状态（已安装 / 未安装 / 远端已移除）。

参数：当前无显式参数。运行时会交互提示选择平台。

### `npx yeizi-skills install`

把指定技能从远端仓库复制到所选平台的技能目录。

| 选项      | 说明                                | 是否必填 |
| --------- | ----------------------------------- | -------- |
| `--skill` | 技能列表，逗号分隔                  | 否（缺省时交互提示） |

## 交互提示与显式参数

参数没传齐时，CLI 会在终端里交互提示你选择。常见场景：

- 跑 `list` 不带任何参数 → 提示选平台
- 跑 `install` 不带 `--skill` → 提示选技能
- 跑 `install` 只带 `--skill` → 提示选平台

在不能交互的场景（脚本、CI、被管道调用）下：

- `list` 当前不支持非交互模式
- `install` 必须显式传齐 `--skill`

## 许可证

MIT