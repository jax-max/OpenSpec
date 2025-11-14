export const agentsTemplate = `# OpenSpec Instructions

Instructions for AI coding assistants using OpenSpec for spec-driven development.

## TL;DR Quick Checklist

- 搜索现有工作: \`openspec spec list --long\`, \`openspec list\` (仅用 \`rg\` 进行全文搜索)
- 确定范围: 新能力 vs 修改现有能力
- 选择唯一的 \`change-id\`: kebab-case，动词引导 (\`add-\`, \`update-\`, \`remove-\`, \`refactor-\`)
- 创建脚手架: \`proposal.md\` (概设), \`design.md\` (详设, 必须), \`tasks.md\`, 以及每个受影响能力的 delta specs (详设)
- 编写 deltas: 使用 \`## ADDED|MODIFIED|REMOVED|RENAMED Requirements\`; 每个 requirement 至少包含一个 \`#### Scenario:\` (使用 mermaid 流程图)
- 验证: \`openspec validate [change-id] --strict\` 并修复问题
- 请求批准: 在提案批准前不要开始实施

## Three-Stage Workflow

### Stage 1: Creating Changes
Create proposal when you need to:
- Add features or functionality
- Make breaking changes (API, schema)
- Change architecture or patterns  
- Optimize performance (changes behavior)
- Update security patterns

Triggers (examples):
- "Help me create a change proposal"
- "Help me plan a change"
- "Help me create a proposal"
- "I want to create a spec proposal"
- "I want to create a spec"

Loose matching guidance:
- Contains one of: \`proposal\`, \`change\`, \`spec\`
- With one of: \`create\`, \`plan\`, \`make\`, \`start\`, \`help\`

Skip proposal for:
- Bug fixes (restore intended behavior)
- Typos, formatting, comments
- Dependency updates (non-breaking)
- Configuration changes
- Tests for existing behavior

**工作流程**
1. 查看 \`openspec/project.md\`, \`openspec list\`, 和 \`openspec list --specs\` 以了解当前上下文。
2. 选择唯一的动词引导的 \`change-id\` 并在 \`openspec/changes/<id>/\` 下创建脚手架：
   - \`proposal.md\` (概设)
   - \`design.md\` (详设，必须创建)
   - \`tasks.md\` (实施步骤)
   - \`specs/\` 下的 spec deltas (详设)
3. 使用 \`## ADDED|MODIFIED|REMOVED Requirements\` 编写 spec deltas，每个 requirement 至少包含一个 \`#### Scenario:\` (使用 mermaid 流程图)。
4. 运行 \`openspec validate <id> --strict\` 并在分享提案前解决所有问题。

### Stage 2: Implementing Changes
将这些步骤作为 TODOs 跟踪并逐一完成。
1. **阅读 proposal.md** - 理解概设（需求背景和系统时序）
2. **阅读 design.md** - 查看详设（技术决策、接口设计、数据库设计等）
3. **阅读 specs/下的 spec.md** - 查看详设（功能点流程图和场景）
4. **阅读 tasks.md** - 获取实施检查清单
5. **按顺序实施任务** - 按顺序完成
6. **确认完成** - 确保 \`tasks.md\` 中的每一项在更新状态前已完成
7. **更新检查清单** - 所有工作完成后，将每个任务设置为 \`- [x]\` 以反映实际情况
8. **批准门控** - 在提案评审并批准前不要开始实施

### Stage 3: Archiving Changes
After deployment, create separate PR to:
- Move \`changes/[name]/\` → \`changes/archive/YYYY-MM-DD-[name]/\`
- Update \`specs/\` if capabilities changed
- Use \`openspec archive <change-id> --skip-specs --yes\` for tooling-only changes (always pass the change ID explicitly)
- Run \`openspec validate --strict\` to confirm the archived change passes checks

## Before Any Task

**Context Checklist:**
- [ ] Read relevant specs in \`specs/[capability]/spec.md\`
- [ ] Check pending changes in \`changes/\` for conflicts
- [ ] Read \`openspec/project.md\` for conventions
- [ ] Run \`openspec list\` to see active changes
- [ ] Run \`openspec list --specs\` to see existing capabilities

**Before Creating Specs:**
- Always check if capability already exists
- Prefer modifying existing specs over creating duplicates
- Use \`openspec show [spec]\` to review current state
- If request is ambiguous, ask 1–2 clarifying questions before scaffolding

### Search Guidance
- Enumerate specs: \`openspec spec list --long\` (or \`--json\` for scripts)
- Enumerate changes: \`openspec list\` (or \`openspec change list --json\` - deprecated but available)
- Show details:
  - Spec: \`openspec show <spec-id> --type spec\` (use \`--json\` for filters)
  - Change: \`openspec show <change-id> --json --deltas-only\`
- Full-text search (use ripgrep): \`rg -n "Requirement:|Scenario:" openspec/specs\`

## Quick Start

### CLI Commands

\`\`\`bash
# Essential commands
openspec list                  # List active changes
openspec list --specs          # List specifications
openspec show [item]           # Display change or spec
openspec validate [item]       # Validate changes or specs
openspec archive <change-id> [--yes|-y]   # Archive after deployment (add --yes for non-interactive runs)

# Project management
openspec init [path]           # Initialize OpenSpec
openspec update [path]         # Update instruction files

# Interactive mode
openspec show                  # Prompts for selection
openspec validate              # Bulk validation mode

# Debugging
openspec show [change] --json --deltas-only
openspec validate [change] --strict
\`\`\`

### Command Flags

- \`--json\` - Machine-readable output
- \`--type change|spec\` - Disambiguate items
- \`--strict\` - Comprehensive validation
- \`--no-interactive\` - Disable prompts
- \`--skip-specs\` - Archive without spec updates
- \`--yes\`/\`-y\` - Skip confirmation prompts (non-interactive archive)

## Directory Structure

\`\`\`
openspec/
├── project.md              # 项目规约
├── specs/                  # 当前真相 - 已构建的内容
│   └── [capability]/       # 单一聚焦的能力域
│       ├── spec.md         # 需求和场景（详设）
│       └── design.md       # 技术模式（详设）
├── changes/                # 提案 - 应当变更的内容
│   ├── [change-name]/
│   │   ├── proposal.md     # 概设：需求描述、产品交互、系统时序图
│   │   ├── design.md       # 详设：接口设计、数据库设计、运维专项（必须）
│   │   ├── tasks.md        # 实施检查清单
│   │   └── specs/          # Delta 变更（详设）
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 已完成的变更
\`\`\`

## Creating Change Proposals

### Decision Tree

\`\`\`
New request?
├─ Bug fix restoring spec behavior? → Fix directly
├─ Typo/format/comment? → Fix directly  
├─ New feature/capability? → Create proposal
├─ Breaking change? → Create proposal
├─ Architecture change? → Create proposal
└─ Unclear? → Create proposal (safer)
\`\`\`

### Proposal Structure

1. **Create directory:** \`changes/[change-id]/\` (kebab-case, verb-led, unique)

2. **Write proposal.md:**
\`\`\`markdown
## 一、需求描述
需求背景，业务诉求，简练语言描述关键要素

## 二、产品交互（可选）
C端客户动线，或运营内管操作动线，用mermaid时序图描述

## 三、系统间时序图
功能点向下系统间交互时序，主要目的为明确系统职责边界，确认分工

### 时序图要求
- 使用 mermaid 格式绘制
- 内容粒度：
  - 人->系统：xx角色访问xx页面，操作xx内容
  - 系统->系统：A调用B的xx接口（rmb或者http），做xx动作
- 使用 mermaid 生成图：
- 差异分支流程用 alt 标签，并发用 par 标签
- 调用内部组件用自引用标识，并写出组件名和目的

\`\`\`mermaid
sequenceDiagram
    participant User as 用户
    participant System as 系统A
    participant Service as 系统B
    
    User->>System: 访问功能页面
    System->>Service: 调用接口（HTTP）
    Service-->>System: 返回结果
    System-->>User: 展示结果
\`\`\`

## 四、详设文档说明
本需求的详设包含两部分：
- **design.md**：技术设计详情（接口设计、数据库设计、运维专项等）
- **specs/[capability]/spec.md**：功能点详细流程图和场景描述

详设文档位置：
- \`openspec/changes/[change-id]/design.md\`
- \`openspec/changes/[change-id]/specs/[capability]/spec.md\`
\`\`\`

3. **Create spec deltas:** \`specs/[capability]/spec.md\`

**重要提示**：如果功能包含多个顺序执行的步骤（如开户流程：验三→联网核查→刷脸→查征信），应该将这些步骤放在**一个 Scenario 的流程图中**，而不是拆成多个 Scenario。只有当存在真正不同的业务场景（如不同用户类型、不同渠道）时，才使用多个 Scenario。

\`\`\`markdown
## ADDED Requirements
### Requirement: 功能名称
系统应当提供...的能力

#### Scenario: 场景名称
使用 mermaid 流程图描述，必须包含4要素：
1. 前置条件：含"当前状态校验 + 业务规则"
2. 触发动作：细化到"用户操作/系统任务/外部回调"
3. 后置操作：含"主档状态更新 + 关联操作 + 日志"
4. 关联接口/组件：补充方法签名或接口 URL + 参数

**如果流程包含多个步骤，将所有步骤放在一个流程图中**：

\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件: 当前状态=ORDER_SUBMITTED 且 金额≥100] --> B[触发动作: 审核员点击通过按钮]
    B --> C[步骤1: 验证订单信息]
    C --> D[步骤2: 检查库存]
    D --> E[步骤3: 计算价格]
    E --> F[后置操作: 更新 t_order.status 为 PASS]
    F --> G[关联接口: POST /api/v1/order/audit]
    G --> H[插入操作日志]
\\\`\\\`\\\`

## MODIFIED Requirements
### Requirement: 已有功能名称
[完整的修改后的需求描述，包含所有场景]

#### Scenario: 修改后的场景
\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件] --> B[触发动作]
    B --> C[后置操作]
    C --> D[关联接口/组件]
\\\`\\\`\\\`

## REMOVED Requirements
### Requirement: 旧功能名称
**移除原因**: [说明为何移除]
**迁移方案**: [如何处理现有使用]
\`\`\`
如果影响多个能力域，在 \`changes/[change-id]/specs/<capability>/spec.md\` 下创建多个 delta 文件—每个能力域一个。

4. **Create tasks.md:**
\`\`\`markdown
> **重要提醒**：实施前请务必阅读 \`openspec/project.md\` 了解项目开发规约和编码规范。

## 1. 实施步骤
- [ ] 1.1 数据库设计
- [ ] 1.2 组件开发（如有）
- [ ] 1.3 接口实现
- [ ] 1.4 测试验证
\`\`\`

5. **Create design.md (必须):**
\`design.md\` 是详设文档，必须创建。包含技术决策、接口设计、数据库设计等详细内容。

详设文档模板：
\`\`\`markdown
## 一、系统模型与本次改动
### 系统模型总图
在 \`proposal.md\` 中的系统间时序图基础上，详细描述系统模型。

### 改动点说明
针对每个改动点详细说明：
- **改动背景**：为什么要改
- **改动范围**：影响哪些模块/组件
- **改动目的**：达成什么目标
- **与 proposal.md 的关系**：如何对应概设中的时序图

## 二、接口设计
### 接口定义清单
列出所有涉及的接口，明确是新增还是修改：

| 接口路径 | 方法 | 类型 | 说明 | 修改点 |
|---------|------|------|------|--------|
| /api/v1/order/create | POST | 新增 | 创建订单 | - |
| /api/v1/order/audit | POST | 修改 | 审核订单 | 新增 remarks 字段 |

### 接口详细设计
对每个接口提供完整设计：

**接口名称**：订单审核接口
- **路径**：POST /api/v1/order/audit
- **请求参数**：
  \\\`\\\`\\\`json
  {
    "orderId": "Long, 订单ID",
    "action": "String, 审核动作: PASS/REJECT",
    "remarks": "String, 审核备注"
  }
  \\\`\\\`\\\`
- **返回结果**：
  \\\`\\\`\\\`json
  {
    "code": 0,
    "message": "success",
    "data": {
      "orderId": "Long",
      "status": "String"
    }
  }
  \\\`\\\`\\\`
- **枚举值说明**：
  - action: PASS(通过), REJECT(驳回)
  - status: PENDING(待审核), APPROVED(已通过), REJECTED(已驳回)
- **错误码**：
  - 1001: 订单不存在
  - 1002: 订单状态不允许审核

### 接口流程图（详设关键产出，AI 生成代码关键输入）
需绘制 场景 - 功能点 - 接口 向下流程图，使用 mermaid 格式。此流程图与 \`specs/\` 下的 spec.md 中的 Scenario 流程图相对应，但更详细。

\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件: 订单状态=PENDING] --> B[触发动作: 调用审核接口]
    B --> C{审核动作}
    C -->|PASS| D[更新订单状态为APPROVED]
    C -->|REJECT| E[更新订单状态为REJECTED]
    D --> F[插入审核日志]
    E --> F
    F --> G[返回结果]
\\\`\\\`\\\`

**流程图要求**：
- 包括所有主流程 + 所有分支流程、分支判断逻辑
- 每条流转路径需明确 4 要素：
  1. **前置条件**：含"当前状态校验 + 业务规则"（例：当前 = ORDER_SUBMITTED 且 金额≥100）
  2. **触发动作**：细化到"用户操作/系统任务/外部回调"（例：审核员点「通过」按钮）
  3. **后置操作**：含"主档状态更新 + 关联操作 + 日志"（例：更新 t_order.status 为 PASS、插操作日志）
  4. **关联接口/组件**：补充方法签名（例：OrderAuditService#passAudit(Long, String)）

## 三、组件设计
### 组件定义
组件指可在多产品领域复用的流程中的公共逻辑。

### 组件说明
若需求涉及组件，需说明：
- 功能描述：[组件做什么]
- 复用场景：[在哪些场景使用]
- 输入参数：[参数列表]
- 输出参数：[返回值]
- 交互关系：[与其他组件的关系]

**若不涉及组件**，标注："本需求无相关组件设计"

**新增组件**：需拉相关领域同事评审

## 四、数据库设计
### 设计原则
- 字段设计：遵循项目规约（见 \`openspec/project.md\`）
- 数据管理：遵循数据管理规范

### 表结构设计
直接在此处编写完整的表结构设计：

**表名**：t_order（订单表）
- **表说明**：存储订单主档信息
- **字段列表**：

| 字段名 | 类型 | 长度 | 是否必填 | 说明 | 索引 |
|--------|------|------|----------|------|------|
| id | BIGINT | - | 是 | 主键ID | PRIMARY |
| order_no | VARCHAR | 64 | 是 | 订单编号 | UNIQUE |
| status | VARCHAR | 32 | 是 | 订单状态 | INDEX |
| amount | DECIMAL | 18,2 | 是 | 订单金额 | - |
| create_time | DATETIME | - | 是 | 创建时间 | INDEX |
| update_time | DATETIME | - | 是 | 更新时间 | - |

**表关系说明**：
- t_order 与 t_order_audit_log 是一对多关系

**ER 图（可选）**：若需要，可使用 mermaid 绘制 ER 图。

## 五、关键功能与测试重点
### 关键功能说明
针对触客、资损相关的关键功能改动，详细说明：
- 业务逻辑
- 触发条件
- 处理流程
- 涉及的业务规则

### 测试重点
- 功能正确性测试：关键功能是否符合业务需求
- 异常场景测试：如触客渠道故障、资损数据异常时的功能表现和 SOP 方法

### 异常处理预案
触客、资损场景必须有异常处理预案：
- 异常场景现象
- 处理方案 SOP

### 兼容性
参考金融严谨性"兼容性"章节。

## 六、运维专项
### 必须项
在此处直接编写运维相关内容：

#### 版本信息
- 版本号：v1.2.0
- 发布时间：2024-01-15
- 依赖版本：[列出关键依赖及版本]

#### 兼容性设计
- 向前兼容：[说明如何与旧版本兼容]
- 向后兼容：[说明如何支持新版本]
- 灰度策略：[如何逐步发布]

#### IT验证方法
1. 单元测试：[测试范围]
2. 集成测试：[测试场景]
3. 性能测试：[性能指标]
4. 验收标准：[通过标准]

#### 回滚方案
- 回滚触发条件：[什么情况下回滚]
- 回滚步骤：
  1. [步骤1]
  2. [步骤2]
- 数据回滚：[如何处理已产生的数据]

### 数据清洗（必须场景）
以下场景必须提供数据清洗方案：
1. 数据修改超过5000或修改业务数据表超过单表数据量20%
2. 数据清洗违反基本原则（未走索引、无备份、无回退方案）但确认需要执行
3. 数据清洗流程复杂且历史未执行过，有时序要求且与业务强耦合
4. 操作手册缺乏必要部分（风险评估、操作方案、验证方案、回退方案）
5. 数据清洗影响业务可用率或需要业务停服配合
6. 运维评估存在高风险的修数方案

**数据清洗方案模板**：
- **风险评估**：[评估影响范围和风险等级]
- **操作方案**：[详细的SQL或脚本，包含备份步骤]
- **验证方案**：[如何验证数据正确性]
- **回退方案**：[出错时如何恢复]

### 其他运维项
#### 数据清理
- 新增流水表必须说明清理策略
- 清理周期：[如30天]
- 清理方式：[归档/删除]

#### 功能开关（关键功能必须）
对触客、资损相关的关键功能必须设计开关：
- 开关名称：order_audit_enabled
- 默认状态：关闭
- 开启条件：[什么情况下开启]

#### HOLD批量（关键功能必须）
对触客、资损相关的关键功能必须支持批量暂停：
- HOLD机制：[如何暂停批量处理]
- 恢复机制：[如何恢复]
\`\`\`

## Spec File Format

### Critical: Scenario Formatting

**正确格式** (使用 #### 标题 + mermaid 流程图):
\`\`\`markdown
#### Scenario: 用户登录成功
\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件: 用户已注册 且 账号状态正常] --> B[触发动作: 用户输入用户名密码点击登录]
    B --> C[后置操作: 生成 JWT token 并更新登录时间]
    C --> D[关联接口: POST /api/v1/auth/login]
\\\`\\\`\\\`
\`\`\`

**错误格式** (不要使用项目符号或加粗):
\`\`\`markdown
- **Scenario: User login**  ❌
**Scenario**: User login     ❌
### Scenario: User login      ❌
\`\`\`

**Scenario 要求**：
- 每个 requirement 必须至少有一个 scenario
- 使用 \`#### Scenario:\` 标题（4个井号）
- 标题下方使用 mermaid 流程图描述场景
- 流程图必须包含4要素：前置条件、触发动作、后置操作、关联接口/组件

**重要：Scenario 与流程步骤的区别**：
- **Scenario 是完整的业务场景**，包含完整的流程（可能包含多个步骤）
- **流程步骤（如验三、联网核查、刷脸、查征信）应该放在一个 Scenario 的流程图中**，作为流程的不同节点
- **不要将流程步骤拆成多个 Scenario**。只有当存在真正不同的业务场景（如不同用户类型、不同渠道导致不同流程）时，才使用多个 Scenario

**正确示例：包含多个步骤的完整流程**
\`\`\`markdown
### Requirement: 开户申请流程
系统应当提供完整的开户申请处理能力，包括身份验证、联网核查、人脸识别和征信查询等步骤。

#### Scenario: 标准开户申请流程
\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件: 用户已填写开户信息 且 状态=待审核] --> B[触发动作: 用户提交开户申请]
    B --> C[步骤1: 验三 - 验证三要素]
    C --> D{验三结果}
    D -->|通过| E[步骤2: 联网核查 - 调用公安系统]
    D -->|失败| Z[拒绝开户]
    E --> F{联网核查结果}
    F -->|通过| G[步骤3: 刷脸 - 人脸识别验证]
    F -->|失败| Z
    G --> H{刷脸结果}
    H -->|通过| I[步骤4: 查征信 - 查询征信系统]
    H -->|失败| Z
    I --> J{征信结果}
    J -->|通过| K[后置操作: 更新账户状态为已开户 并 生成账户信息]
    J -->|失败| Z
    K --> L[关联接口: POST /api/v1/account/create]
    L --> M[插入开户日志]
\\\`\\\`\\\`
\`\`\`

**错误示例：将流程步骤拆成多个 Scenario** ❌
\`\`\`markdown
### Requirement: 开户申请流程
系统应当提供开户申请处理能力。

#### Scenario: 验三
[只有验三步骤] ❌ 这不是场景，是步骤

#### Scenario: 联网核查
[只有联网核查步骤] ❌ 这不是场景，是步骤

#### Scenario: 刷脸
[只有刷脸步骤] ❌ 这不是场景，是步骤
\`\`\`

### Requirement Wording
- 使用"应当"、"必须"等规范性词语描述需求（避免使用"可以"、"可能"等非规范性词语）
- Requirement 名称可以使用中文

### Delta Operations

- \`## ADDED Requirements\` - 新增能力
- \`## MODIFIED Requirements\` - 变更行为
- \`## REMOVED Requirements\` - 废弃功能
- \`## RENAMED Requirements\` - 名称变更

标题匹配使用 \`trim(header)\` - 忽略空白字符。

#### When to use ADDED vs MODIFIED
- **ADDED（新增）**: 引入可以独立存在的新能力或子能力。当变更是正交的（例如添加"斜杠命令配置"）而不是改变现有需求的语义时，优先使用 ADDED。
- **MODIFIED（修改）**: 改变现有需求的行为、范围或验收标准。始终粘贴完整的、更新后的需求内容（标题 + 所有场景）。归档器将用你提供的内容替换整个需求；部分 delta 将导致之前的细节丢失。
- **RENAMED（重命名）**: 仅当名称改变时使用。如果同时改变行为，使用 RENAMED（名称）加 MODIFIED（内容）引用新名称。

**常见陷阱**: 使用 MODIFIED 添加新关注点而不包含之前的文本。这会在归档时导致细节丢失。如果你不是明确地改变现有需求，而是在 ADDED 下添加新需求。

**正确编写 MODIFIED 需求的步骤**:
1) 在 \`openspec/specs/<capability>/spec.md\` 中定位现有需求。
2) 复制整个需求块（从 \`### Requirement: ...\` 到它的所有场景）。
3) 将其粘贴到 \`## MODIFIED Requirements\` 下并编辑以反映新行为。
4) 确保标题文本精确匹配（忽略空白符）并保留至少一个 \`#### Scenario:\`。

**RENAMED 示例**:
\`\`\`markdown
## RENAMED Requirements
- FROM: \`### Requirement: 用户登录\`
- TO: \`### Requirement: 用户身份认证\`
\`\`\`

## Troubleshooting

### Common Errors

**"Change must have at least one delta"**
- Check \`changes/[name]/specs/\` exists with .md files
- Verify files have operation prefixes (## ADDED Requirements)

**"Requirement must have at least one scenario"**
- Check scenarios use \`#### Scenario:\` format (4 hashtags)
- Don't use bullet points or bold for scenario headers

**Silent scenario parsing failures**
- Exact format required: \`#### Scenario: Name\`
- Debug with: \`openspec show [change] --json --deltas-only\`

### Validation Tips

\`\`\`bash
# Always use strict mode for comprehensive checks
openspec validate [change] --strict

# Debug delta parsing
openspec show [change] --json | jq '.deltas'

# Check specific requirement
openspec show [spec] --json -r 1
\`\`\`

## Happy Path Script

\`\`\`bash
# 1) 探索当前状态
openspec spec list --long
openspec list
# 可选的全文搜索:
# rg -n "Requirement:|Scenario:" openspec/specs
# rg -n "^#|Requirement:" openspec/changes

# 2) 选择 change id 并创建脚手架
CHANGE=add-two-factor-auth
mkdir -p openspec/changes/$CHANGE/{specs/auth}
cat > openspec/changes/$CHANGE/proposal.md << 'EOF'
## 一、需求描述
实现双因素认证功能，提升账户安全性

## 二、产品交互（可选）
用户登录时需要输入密码 + 验证码

## 三、系统间时序图
[添加 mermaid 时序图]

## 四、详设文档路径
\\\`openspec/changes/add-two-factor-auth/design.md\\\`
EOF

cat > openspec/changes/$CHANGE/tasks.md << 'EOF'
> **重要提醒**：实施前请务必阅读 \\\`openspec/project.md\\\` 了解项目开发规约和编码规范。

## 1. 实施步骤
- [ ] 1.1 数据库设计
- [ ] 1.2 组件开发（如有）
- [ ] 1.3 接口实现
- [ ] 1.4 测试验证
EOF

# 3) 添加 deltas (示例)
cat > openspec/changes/$CHANGE/specs/auth/spec.md << 'EOF'
## ADDED Requirements
### Requirement: 双因素认证
用户必须在登录时提供第二因素验证。

#### Scenario: OTP 验证流程
\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件: 用户已输入正确密码] --> B[触发动作: 系统发送 OTP 到用户手机]
    B --> C[后置操作: 验证 OTP 并生成会话]
    C --> D[关联接口: POST /api/v1/auth/verify-otp]
\\\`\\\`\\\`
EOF

# 4) 验证
openspec validate $CHANGE --strict
\`\`\`

## Multi-Capability Example

\`\`\`
openspec/changes/add-2fa-notify/
├── proposal.md
├── tasks.md
└── specs/
    ├── auth/
    │   └── spec.md   # ADDED: 双因素认证
    └── notifications/
        └── spec.md   # ADDED: OTP 邮件通知
\`\`\`

auth/spec.md
\`\`\`markdown
## ADDED Requirements
### Requirement: 双因素认证
用户必须在登录时提供第二因素验证。

#### Scenario: 验证流程
\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件] --> B[触发动作]
    B --> C[后置操作]
    C --> D[关联接口]
\\\`\\\`\\\`
\`\`\`

notifications/spec.md
\`\`\`markdown
## ADDED Requirements
### Requirement: OTP 邮件通知
系统应当在用户登录时发送 OTP 验证码邮件。

#### Scenario: 发送邮件
\\\`\\\`\\\`mermaid
flowchart TD
    A[前置条件: 用户请求登录] --> B[触发动作: 生成 OTP]
    B --> C[后置操作: 发送邮件并记录]
    C --> D[关联接口: POST /api/v1/notifications/send-otp]
\\\`\\\`\\\`
\`\`\`

## Best Practices

### Simplicity First
- Default to <100 lines of new code
- Single-file implementations until proven insufficient
- Avoid frameworks without clear justification
- Choose boring, proven patterns

### Complexity Triggers
Only add complexity with:
- Performance data showing current solution too slow
- Concrete scale requirements (>1000 users, >100MB data)
- Multiple proven use cases requiring abstraction

### Clear References
- Use \`file.ts:42\` format for code locations
- Reference specs as \`specs/auth/spec.md\`
- Link related changes and PRs

### Capability Naming
- Use verb-noun: \`user-auth\`, \`payment-capture\`
- Single purpose per capability
- 10-minute understandability rule
- Split if description needs "AND"

### Change ID Naming
- Use kebab-case, short and descriptive: \`add-two-factor-auth\`
- Prefer verb-led prefixes: \`add-\`, \`update-\`, \`remove-\`, \`refactor-\`
- Ensure uniqueness; if taken, append \`-2\`, \`-3\`, etc.

## Tool Selection Guide

| Task | Tool | Why |
|------|------|-----|
| Find files by pattern | Glob | Fast pattern matching |
| Search code content | Grep | Optimized regex search |
| Read specific files | Read | Direct file access |
| Explore unknown scope | Task | Multi-step investigation |

## Error Recovery

### Change Conflicts
1. Run \`openspec list\` to see active changes
2. Check for overlapping specs
3. Coordinate with change owners
4. Consider combining proposals

### Validation Failures
1. Run with \`--strict\` flag
2. Check JSON output for details
3. Verify spec file format
4. Ensure scenarios properly formatted

### Missing Context
1. Read project.md first
2. Check related specs
3. Review recent archives
4. Ask for clarification

## Quick Reference

### Stage Indicators
- \`changes/\` - 提案中，尚未构建
- \`specs/\` - 已构建并部署
- \`archive/\` - 已完成的变更

### File Purposes
- \`proposal.md\` - 概设：需求描述、产品交互、系统时序图
- \`design.md\` - 详设：接口设计、数据库设计、运维专项（必须）
- \`spec.md\` - 详设：功能点流程图和场景描述
- \`tasks.md\` - 实施步骤

### CLI Essentials
\`\`\`bash
openspec list              # What's in progress?
openspec show [item]       # View details
openspec validate --strict # Is it correct?
openspec archive <change-id> [--yes|-y]  # Mark complete (add --yes for automation)
\`\`\`

Remember: Specs are truth. Changes are proposals. Keep them in sync.
`;
