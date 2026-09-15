# mingto-skills

将 [mt-utils](http://git.mingto.net/hcc/mt-utils) 仓库中的技能同步到本地平台的技能目录。

```bash
npx mingto-skills
```

## 支持平台

| 平台     | 技能目录               |
| ------ | ------------------ |
| codex  | `~/.codex/skills`  |
| claude | `~/.claude/skills` |
| trae   | `~/.trae/skills`   |

## 命令参考

### `npx mingto-skills list`

查看本地平台已添加的技能列表。

### `npx mingto-skills add`

安装技能至本地平台。

| 选项        | 说明        | 是否必填           |
| --------- | --------- | -------------- |
| `--skill` | 技能列表，逗号分隔 | 否 |

### `npx mingto-skills remove`

从本地平台目录移除指定技能。

| 选项        | 说明        | 是否必填           |
| --------- | --------- | -------------- |
| `--skill` | 技能列表，逗号分隔 | 否 |

## 许可证

MIT
