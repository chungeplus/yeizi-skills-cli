# yeizi-skills README 完善设计

日期：2026-07-03
范围：替换 `README.md`，只面向最终使用者

## 目标

把 `README.md` 改写成纯使用者视角的文档，让一个第一次打开它的读者能：

1. 知道 yeizi-skills 是什么、能做什么
2. 知道使用前要满足哪些前提
3. 在 30 秒内跑出第一条命令
4. 遇到具体命令时能查表查到完整选项

## 范围

- **纳入 README**：工具是什么、使用前提、平台与默认路径、快上手、命令参考、交互提示与显式参数、许可证
- **从 README 移除**：
  - 维护者开发流程（`bun install` / `bun run typecheck` / `bun run lint` / `bun run build`）
  - 发布流程（`bun run check` / `bun publish`）
  - SKILL.md frontmatter 规范（`name` / `description` 字段要求、`version` 废弃说明等）
- **不纳入 README**：
  - 远端仓库地址、git 协议实现细节、inquirer 实现细节
  - 平台 `all`（用户已从代码中删除 `all` 平台支持，README 不再提及）
  - 安装完成后在 codex / claude / trae 里如何调用技能（由各 AI 工具自己负责说明）

## 结构（方案 A：故事流式）

按"打开 README → 了解它 → 准备环境 → 跑起来 → 查命令"的顺序组织，从前往后读就能完成所有事。

1. 标题 + 一句话描述
2. 支持平台（表格列出 codex / claude / trae 及其默认技能目录）
3. 使用前提（Node ≥ 20、可访问 GitHub）
4. 30 秒快上手（最少可运行示例）
5. 命令参考（`npx` 默认行为、`list`、`install`）
6. 交互提示与显式参数
7. 许可证

## 内容设计

### 1. 标题与一句话

```markdown
# yeizi-skills

命令行工具，把远端 `yeizi-skills` 仓库中的技能同步到本地 AI 工具的技能目录。
```

### 2. 支持平台

```markdown
## 支持平台

| 平台    | 技能目录                  |
| ------- | ------------------------- |
| codex   | `~/.codex/skills`         |
| claude  | `~/.claude/skills`        |
| trae    | `~/.trae/skills`          |
```

不写 `all`。用户已确认从代码移除 `all` 平台支持。

### 3. 使用前提

```markdown
## 使用前提

- 已安装 Node.js `>= 20`
- 当前网络可以访问 GitHub（CLI 会用 git 协议拉取仓库快照）
```

不写"目标平台 skills 目录必须存在"。该限制由 CLI 在运行期静默跳过未存在目录处理，README 不暴露实现细节。

### 4. 30 秒快上手

```markdown
## 30 秒快上手

不带子命令直接执行，会显示帮助信息：

​```bash
npx yeizi-skills
​```

查看所选平台上的技能（不传参数时 CLI 会交互提示选平台）：

​```bash
npx yeizi-skills list
​```

为指定平台安装技能（不传平台时同样会交互提示）：

​```bash
npx yeizi-skills install --skill yeizi-auto-self-review
​```
```

设计说明：

- 当前 `list` 不支持任何选项，只能走交互模式
- 当前 `install` 只支持 `--skill`，平台选择走交互模式
- 沿用代码现状，不在 README 中预留尚未实现的 `--platform` 选项

### 5. 命令参考

```markdown
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
```

设计说明：

- `list` 当前不接任何选项，命令参考里写明"无显式参数、运行期交互提示选平台"
- `install` 只列 `--skill`，平台走交互提示
- 选项表只列用户实际可传的参数，命令隐式从交互提示获取的不列

### 6. 交互提示与显式参数

```markdown
## 交互提示与显式参数

参数没传齐时，CLI 会在终端里交互提示你选择。常见场景：

- 跑 `list` 不带任何参数 → 提示选平台
- 跑 `install` 不带 `--skill` → 提示选技能
- 跑 `install` 只带 `--skill` → 提示选平台

在不能交互的场景（脚本、CI、被管道调用）下：

- `list` 当前不支持非交互模式
- `install` 必须显式传齐 `--skill`
```

设计说明：

- 用"能不能交互"这个用户能感知的概念解释，不透露 inquirer / 非 TTY 等内部判断
- 明确"不能交互时哪些命令能用、哪些不能用"，让用户在脚本场景下不会踩坑

### 7. 许可证

```markdown
## 许可证

MIT
```

直接复用 `package.json` 里的 `license: "MIT"`。

## 不做什么

- 不在 README 里解释 `yeizi-skills` 仓库本身的结构、SKILL.md frontmatter 规范、远端仓库布局
- 不写贡献指南（CONTRIBUTING.md 不在本次范围）
- 不写 `all` 平台（已从代码移除）
- 不写"安装完后怎么在 AI 工具里用"
- 不写命令的实现细节、错误码表、调试技巧

## 验收标准

- 第一次打开 README 的使用者，能在不离开 README 的情况下完成：了解工具 → 装好前提 → 跑出第一条命令 → 安装一个技能
- README 中不出现：维护者命令、发布命令、SKILL.md frontmatter 规范、`all` 平台、`--platform` 选项（在支持前不预告）
- README 中所有命令示例在当前代码下都可以正常运行（`npx yeizi-skills`、`npx yeizi-skills list`、`npx yeizi-skills install --skill <list>`）
- 与 `package.json` 中的 `license: "MIT"` 一致
