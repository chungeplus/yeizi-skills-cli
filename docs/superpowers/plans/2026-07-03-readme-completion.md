# yeizi-skills README 完善实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `README.md` 改写为纯使用者视角，按 spec 的 7 节结构组织内容，删除维护者流程、发布流程、SKILL.md frontmatter 规范三节。

**Architecture:** 单一文件替换。读取 spec 中"内容设计"一节的最终内容，整段写入 `README.md`；写完后用文件读取和内容搜索对照 spec 验收标准做自验。不引入新依赖、不改其他源码文件。

**Tech Stack:** 无新增技术栈。只需要文件系统读写 + grep 类文本检查。

## Global Constraints

来源 spec：`docs/superpowers/specs/2026-07-03-readme-completion-design.md`

- 目标文件路径：`README.md`（项目根，Windows 路径为 `C:\Users\yeizi\Desktop\cli\yeizi-skills\README.md`）
- 结构顺序（不可调换）：标题与一句话 → 支持平台表 → 使用前提 → 30 秒快上手 → 命令参考 → 交互提示与显式参数 → 许可证
- 平台只列 `codex` / `claude` / `trae`；不写 `all`
- 命令示例以当前代码真实支持的形态为准：`list` 不接任何显式参数（走交互），`install` 只接 `--skill`（平台走交互）
- 不写：维护者开发流程、发布流程、SKILL.md frontmatter 规范、安装完成后在 AI 工具里如何调用技能
- 许可证字段：与 `package.json` 中 `license: "MIT"` 一致
- 项目不是 git 仓库，所有任务中的 git 步骤跳过，不执行
- 全文面向人阅读，使用中文（与现有 README 文风一致）

---

### Task 1：写入新 README.md

**Files:**
- Modify: `README.md`（项目根，完整替换现有内容）
- Read: `package.json`（确认 license 字段）
- Read: `docs/superpowers/specs/2026-07-03-readme-completion-design.md`（内容来源）

**Interfaces:**
- Consumes: 本 plan 不依赖前序任务产出；本任务为后续 Task 2 的待验对象
- Produces: 项目根的 `README.md`，内容完全等同于本任务 Step 2 给出的最终内容

- [ ] **Step 1: 读取 `package.json` 的 license 字段**

读 `C:\Users\yeizi\Desktop\cli\yeizi-skills\package.json`，确认 `"license": "MIT"` 这一行存在。许可证章节的"MIT"二字以这个字段为准。

期望输出：文件中存在 `"license": "MIT"`。

- [ ] **Step 2: 用以下内容整体覆盖 `README.md`**

使用 Write 工具（不是 Edit）把下面这段一次性写入 `C:\Users\yeizi\Desktop\cli\yeizi-skills\README.md`，覆盖原文件。

下面这段外层用了 4 反引号的围栏，里面 ```` ```bash ```` 开头 / ```` ``` ```` 结尾是 README 自己要保留的 bash 代码块围栏。写入 `README.md` 时**只复制外层围栏之间的整段内容**，外层围栏本身不要写进 README。

````markdown
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
````

注意：
- 写入时**不要**把外层 4 反引号围栏和 ``markdown`` 语言标签写进 `README.md`
- 写入时**要**保留里面的 ```` ```bash ```` 和 ```` ``` ```` bash 代码块围栏
- 不要在写入时插入任何"草稿""TODO""TBD"等占位文字
- 不要调整章节顺序
- 不要新增 `all` 平台行

- [ ] **Step 3: 自检文件已写入**

读 `C:\Users\yeizi\Desktop\cli\yeizi-skills\README.md`，确认：

- 文件以 `# yeizi-skills` 开头
- 文件以 `MIT\n` 结尾（最后一段是"许可证"且只写了 MIT 三个字符）
- 总行数大约在 60-80 行之间

期望输出：上述三点都成立。如果不成立，重新执行 Step 2。

- [ ] **Step 4: 跳过 git 提交**

本项目不是 git 仓库（`git rev-parse` 在项目根返回 `fatal: not a git repository`）。本任务不执行 `git add` / `git commit`，变更留存在工作区。

---

### Task 2：按 spec 验收标准自验 README

**Files:**
- Read: `README.md`（待验对象）
- Read: `package.json`（交叉验证 license）
- Read: `docs/superpowers/specs/2026-07-03-readme-completion-design.md`（验收清单来源）

**Interfaces:**
- Consumes: Task 1 写入的 `README.md`
- Produces: 验收结论（在最终回复中向用户报告）。若失败，列出未通过的检查项

- [ ] **Step 1: 必备章节存在性检查**

用 Grep 工具（不要用 bash 的 grep），路径 `C:\Users\yeizi\Desktop\cli\yeizi-skills\README.md`，分别用以下 pattern 检查，期望每个都有命中：

- `^# yeizi-skills$` → 命中 1 次（标题）
- `^## 支持平台$` → 命中 1 次
- `^## 使用前提$` → 命中 1 次
- `^## 30 秒快上手$` → 命中 1 次
- `^## 命令参考$` → 命中 1 次
- `^## 交互提示与显式参数$` → 命中 1 次
- `^## 许可证$` → 命中 1 次

期望输出：7 个 pattern 各自至少 1 个命中。

- [ ] **Step 2: 删除章节存在性检查**

用 Grep 工具，路径同上，分别检查以下 pattern，期望**全部 0 命中**：

- `维护者开发流程`
- `发布流程`
- `bun install`
- `bun publish`
- `frontmatter`
- `version 字段已废弃`
- `tags`

期望输出：7 个 pattern 全部 0 命中。任意一个命中即视为失败，需要回到 Task 1 重写。

- [ ] **Step 3: `all` 平台未出现**

用 Grep 工具，路径 `README.md`，pattern `^\| all \|`（按行首管道符 + 空格 + all + 空格 + 管道符），期望 0 命中。

注意：不能用裸 `all` 搜索，因为正文里"命令行工具"等可能误命中（实际不会，但稳妥起见用锚定行首 + 表格列格式）。

期望输出：0 命中。

- [ ] **Step 4: 命令示例形态检查**

用 Grep 工具，路径 `README.md`，分别检查：

- `^npx yeizi-skills$` → 至少 1 个命中（在 30 秒快上手或命令参考里）
- `^npx yeizi-skills list$` → 至少 1 个命中（注意 `$` 锚定行尾，不带任何参数）
- pattern 字符串字面量 `npx yeizi-skills list --platform` → 0 命中（不写尚未支持的 `--platform`）
- pattern 字符串字面量 `npx yeizi-skills install --platform` → 0 命中（同样不写）
- pattern 字符串字面量 `npx yeizi-skills install --skill` → 至少 1 个命中

期望输出：上述 5 条全部按预期数量命中。

- [ ] **Step 5: 许可证一致性检查**

读 `README.md` 末尾"许可证"章节（最后三行），期望内容为：

```
## 许可证

MIT
```

读 `package.json`，期望 `"license": "MIT"` 一致。

期望输出：两处都是 `MIT`，完全一致。

- [ ] **Step 6: 报告验收结果**

向用户报告：

- 必备章节数：7/7 命中
- 删除章节数：7/7 零命中
- `all` 平台：未出现
- 命令示例：3/3 形态正确
- 许可证：与 `package.json` 一致

若任意一项不通过，回到 Task 1 重新生成 README.md，再回到本任务重跑。

---

## 计划完成后的整体确认

执行完 Task 1 和 Task 2 后，最终向用户报告：

- README.md 已按 spec 替换
- 验收 5 项全部通过（或哪几项失败）
- 变更留存在工作区，未做 git 提交（项目非 git 仓库）
