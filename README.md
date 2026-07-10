# yeizi-skills

将 [yeizi-skills](https://github.com/chungeplus/yeizi-skills) 仓库中的技能同步到本地平台的技能目录。

```bash
npx yeizi-skills
```

## 支持平台

| 平台     | 技能目录               |
| ------ | ------------------ |
| codex  | `~/.codex/skills`  |
| claude | `~/.claude/skills` |
| trae   | `~/.trae/skills`   |

## 命令参考

### `npx yeizi-skills list`

查看本地平台已添加的技能列表。

### `npx yeizi-skills add`

安装技能至本地平台。

| 选项        | 说明        | 是否必填           |
| --------- | --------- | -------------- |
| `--skill` | 技能列表，逗号分隔 | 否 |

### `npx yeizi-skills remove`

从本地平台目录移除指定技能。

| 选项        | 说明        | 是否必填           |
| --------- | --------- | -------------- |
| `--skill` | 技能列表，逗号分隔 | 否 |

## 许可证

MIT
