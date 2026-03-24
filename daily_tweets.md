---
title: 2026-03-25 科技金融热点速递
cover: https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop
---

# 2026-03-25 科技金融热点速递

精选自 X 平台 AI 领域热门讨论，每日更新。

---

## 1. **LiteLLM已遭入侵，切勿更新。** 我们刚刚发现LiteLLM在PyPI上发布的1.82.8...

**来源：** @hnykda

### 📝 原文

LiteLLM HAS BEEN COMPROMISED, DO NOT UPDATE. We just discovered that LiteLLM pypi release 1.82.8. It has been compromised, it contains litellm_init.pth with base64 encoded instructions to send all the credentials it can find to remote server + self-replicate. link below

### 🌐 专业翻译

**LiteLLM已遭入侵，切勿更新。** 我们刚刚发现LiteLLM在PyPI上发布的1.82.8版本已被攻陷。该版本包含恶意文件litellm_init.pth，其中含有base64编码的指令，会窃取系统中所有可获取的凭证并发送至远程服务器，同时具备自我复制能力。详情见下方链接。

### 🎯 核心发现

这是一起针对AI基础设施关键组件的供应链攻击事件。LiteLLM作为广泛使用的大语言模型统一接口库，其PyPI官方发行版本被植入恶意代码，能够窃取API密钥、访问令牌等敏感凭证，并通过自复制机制扩大影响范围。

### 💡 深度解读

**背景分析：**
LiteLLM是AI开发生态中的关键中间件，为开发者提供统一接口调用OpenAI、Anthropic、Azure等多家LLM服务。这次攻击选择在PyPI（Python包索引）这一开发者信任的官方渠道投毒，利用了软件供应链中最脆弱的环节——包管理系统的信任机制。

**行业意义：**
1. **AI基础设施成为高价值攻击目标** - 随着企业大规模部署LLM应用，集中管理API凭证的工具成为攻击者的首选目标，一次成功入侵可能获取数百家企业的API访问权限

2. **开源生态安全隐患凸显** - PyPI等包管理平台的审核机制在面对精心设计的攻击时显得力不从心，base64编码混淆等简单技术就能绕过基础检测

3. **凭证管理危机** - 许多开发团队将API密钥直接存储在环境变量或配置文件中，这种做法在供应链攻击面前毫无防御能力

**为什么重要：**
这不是孤立事件，而是反映了AI时代新型攻击面的出现。与传统软件不同，LLM应用的凭证往往直接关联计费账户和敏感数据访问权限，被盗凭证可立即变现或用于数据窃取，影响链条更短、危害更直接。

### 🔄 可迁移洞察

1. **金融科技领域** - 支付SDK、加密货币钱包库等金融基础组件同样面临供应链投毒风险，需建立类似的实时监控和快速响应机制

2. **云原生安全** - Kubernetes Helm Charts、Terraform模块等基础设施即代码(IaC)组件的完整性验证变得至关重要

3. **企业采购策略** - 开源依赖项的安全审计应从"事后检查"转向"持续监控"，建立依赖项指纹库和异常行为检测系统

4. **零信任架构** - 即使是可信来源的代码也应在隔离环境中运行，凭证应采用短期令牌+密钥管理服务(KMS)的组合方案

🏷️ **标签：** 供应链攻击、PyPI投毒、凭证窃取、AI基础设施安全、开源生态风险

📊 **数据：** 浏览 2738532 | 点赞 6616 | 转发 1638

🔗 [查看原文](https://x.com/hnykda/status/2036414330267193815)

---

## 2. 软件恐怖：litellm PyPI 供应链攻击。   简单的“pip install litellm...

**来源：** @karpathy

### 📝 原文

Software horror: litellm PyPI supply chain attack. 

Simple `pip install litellm` was enough to exfiltrate SSH keys, AWS/GCP/Azure creds, Kubernetes configs, git credentials, env vars (all your API keys), shell history, crypto wallets, SSL private keys, CI/CD secrets, database passwords.

LiteLLM itself has 97 million downloads per month which is already terrible, but much worse, the contagion spreads to any project that depends on litellm. For example, if you did `pip install dspy` (which depen

### 🌐 专业翻译

软件恐怖：litellm PyPI 供应链攻击。 

简单的“pip install litellm”足以泄露 SSH 密钥、AWS/GCP/Azure 凭证、Kubernetes 配置、git 凭证、环境变量（所有 API 密钥）、shell 历史记录、加密钱包、SSL 私钥、CI/CD 机密、数据库密码。

LiteLLM 本身每月有 9700 万次下载，这已经很糟糕了，但更糟糕的是，这种传染会蔓延到任何依赖 litellm 的项目。例如，如果您执行了“pip install dspy”（这取决于 litellm>=1.64.0），您也会被 pwnd 。对于任何其他依赖于 litellm 的大型项目也是如此。

事实上，中毒版本仅运行了不到 1 小时。该攻击有一个导致其被发现的错误 - Callum McMahon 在 Cursor 中使用了 MCP 插件，该插件将 litellm 作为传递依赖项引入。当安装 litellm 1.82.8 时，他们的机器内存不足并崩溃了。因此，如果攻击者没有对这次攻击进行振动编码，那么它可能会在几天或几周内未被检测到。

像这样的供应链攻击基本上是现代软件中可以想象到的最可怕的事情。每次安装任何依赖项时，您都可能会在整个依赖项树深处的任何位置拉入有毒的包。对于可能有很多依赖项的大型项目来说，这尤其危险。每次攻击中被盗的凭据可用于接管更多帐户并危害更多软件包。

经典软件工程会让你相信依赖关系是好的（我们正在用砖块建造金字塔），但在我看来，这必须重新评估，这就是为什么我越来越反对它们，更喜欢使用法学硕士来“yoink”功能，当它足够简单和可能时。

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 2898541 | 点赞 12959 | 转发 2341

🔗 [查看原文](https://x.com/karpathy/status/2036487306585268612)

---

## 3. Claude代码中的新功能：自动模式。  自动模式让 Claude 代表您做出权限决定，而不是批准每...

**来源：** @claudeai

### 📝 原文

New in Claude Code: auto mode.

Instead of approving every file write and bash command, or skipping permissions entirely, auto mode lets Claude make permission decisions on your behalf.

Safeguards check each action before it runs.

### 🌐 专业翻译

Claude代码中的新功能：自动模式。

自动模式让 Claude 代表您做出权限决定，而不是批准每个文件写入和 bash 命令，或者完全跳过权限。

保障措施会在每个操作运行之前对其进行检查。

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 2135865 | 点赞 22954 | 转发 1430

🔗 [查看原文](https://x.com/claudeai/status/2036503582166393240)

---

## 4. 我们要告别 Sora 应用程序了。对于所有使用 Sora 进行创作、分享并围绕它建立社区的人：谢谢你...

**来源：** @soraofficialapp

### 📝 原文

We’re saying goodbye to the Sora app. To everyone who created with Sora, shared it, and built community around it: thank you. What you made with Sora mattered, and we know this news is disappointing.

We’ll share more soon, including timelines for the app and API and details on preserving your work. – The Sora Team

### 🌐 专业翻译

我们要告别 Sora 应用程序了。对于所有使用 Sora 进行创作、分享并围绕它建立社区的人：谢谢你们。你与 Sora 所做的一切很重要，我们知道这个消息令人失望。

我们将很快分享更多信息，包括应用程序和 API 的时间表以及有关保存您的作品的详细信息。 – 索拉团队

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 2791941 | 点赞 8908 | 转发 1199

🔗 [查看原文](https://x.com/soraofficialapp/status/2036546752535470382)

---

## 5. 肌萎缩侧索硬化症（ALS）逐渐剥夺了肯尼思的说话能力。通过 Neuralink 的 VOICE 临床...

**来源：** @neuralink

### 📝 原文

ALS has gradually taken away Kenneth’s ability to speak. Through Neuralink’s VOICE clinical trial, he’s exploring how a brain-computer interface designed to translate thought to speech could help restore autonomy in his daily life.

Watch to learn more:

### 🌐 专业翻译

肌萎缩侧索硬化症（ALS）逐渐剥夺了肯尼思的说话能力。通过 Neuralink 的 VOICE 临床试验，他正在探索旨在将思想转化为语音的脑机接口如何帮助他恢复日常生活的自主权。

观看以了解更多信息：

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 11610383 | 点赞 10377 | 转发 1865

🔗 [查看原文](https://x.com/neuralink/status/2036489073091580011)

---

## 6. 我们筹集了 750 万美元来消除 AI 垃圾。  隆重介绍 Moda：全球第一家有品位的设计代理商。...

**来源：** @anvisha

### 📝 原文

We raised $7.5M to kill AI slop.

Introducing Moda: the world's first design agent with taste.

RT+ comment “Moda” and we’ll design your brand for FREE.

### 🌐 专业翻译

我们筹集了 750 万美元来消除 AI 垃圾。

隆重介绍 Moda：全球第一家有品位的设计代理商。

RT+评论“Moda”，我们将免费设计您的品牌。

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 1837471 | 点赞 3215 | 转发 808

🔗 [查看原文](https://x.com/anvisha/status/2036474296353411290)

---

## 7. 我们要和索拉说再见了。对于所有使用 Sora 进行创作、分享并围绕它建立社区的人：谢谢你们。你与 S...

**来源：** @soraofficialapp

### 📝 原文

We’re saying goodbye to Sora. To everyone who created with Sora, shared it, and built community around it: thank you. What you made with Sora mattered, and we know this news is disappointing.

We’ll share more soon, including timelines for the app and API and details on

### 🌐 专业翻译

我们要和索拉说再见了。对于所有使用 Sora 进行创作、分享并围绕它建立社区的人：谢谢你们。你与 Sora 所做的一切很重要，我们知道这个消息令人失望。

我们将很快分享更多信息，包括应用程序和 API 的时间表以及有关的详细信息

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 1336618 | 点赞 5222 | 转发 468

🔗 [查看原文](https://x.com/soraofficialapp/status/2036532795984715896)

---

## 8. 人们花 700 美元购买 mac mini 来运行 openclaw 代理，观看 claude 以 ...

**来源：** @davidonchainx

### 📝 原文

People who spent $700 on a mac mini to run an openclaw agent watching claude launch all the features natively for $20

### 🌐 专业翻译

人们花 700 美元购买 mac mini 来运行 openclaw 代理，观看 claude 以 20 美元的价格原生推出所有功能

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 4799902 | 点赞 31237 | 转发 1497

🔗 [查看原文](https://x.com/davidonchainx/status/2036233287115460852)

---

## 9. 现在，你可以通过AI代理直接在Figma画布上进行设计。我们推出了全新的use_figma MCP工...

**来源：** @figma

### 📝 原文

Now you can use AI agents to design directly on the Figma canvas, with our new use_figma MCP tool and skills to teach them. Open beta starts today.

### 🌐 专业翻译

现在，你可以通过AI代理直接在Figma画布上进行设计。我们推出了全新的use_figma MCP工具，并提供技能训练功能来教会AI代理如何操作。开放测试版今日正式启动。

### 🎯 核心发现

Figma正式将AI Agent能力集成到其设计平台核心工作流中，通过MCP（Model Context Protocol）协议实现AI代理对设计画布的直接操控。这标志着设计工具从"辅助功能"向"自主执行"的范式转变——AI不再只是提供建议，而是成为可以独立完成设计任务的协作者。

### 💡 深度解读

**背景分析**  
MCP是Anthropic推出的标准化协议，用于让AI模型与外部工具进行结构化交互。Figma选择基于MCP构建use_figma工具，意味着其AI能力可以被任何支持MCP的AI系统调用，而非局限于自家生态。这是一个开放性的战略选择。

**行业意义**  
这次发布有三个关键突破点：
1. **工具层互操作性**：通过MCP标准，Figma将设计能力开放给整个AI生态，可能催生"设计即服务"的新商业模式
2. **技能可训练性**："skills to teach them"暗示Figma提供了某种prompt工程或fine-tuning机制，让企业可以定制AI的设计行为模式
3. **生产力重构**：设计师角色可能从"执行者"转向"指挥者"，专注于创意方向而非像素级操作

**为什么重要**  
Figma拥有超过400万付费用户，其动作往往定义行业标准。此举可能引发连锁反应：Adobe、Sketch等竞品必须跟进；更重要的是，它验证了"AI Agent作为生产力工具"的商业可行性，为其他垂直领域（代码编辑、数据分析、3D建模）提供了范本。

### 🔄 可迁移洞察

这个"MCP + 可训练技能"的模式具有强迁移性：

- **金融建模**：AI Agent直接操作Excel/Bloomberg终端，根据分析师定义的"技能"自动生成财务模型
- **法律文档**：在合同管理系统中，AI按律所训练的"审查技能"自动标注风险条款
- **医疗影像**：放射科医生教AI识别特定病灶特征，AI在PACS系统中自动标注可疑区域
- **建筑设计**：BIM软件集成AI Agent，按建筑师定义的规范自动优化结构设计

核心逻辑是：将领域专家的隐性知识编码为"可教技能"，让AI在专业工具中自主执行重复性高但需要专业判断的任务。

🏷️ **标签：** AI Agent、MCP协议、设计自动化、工具互操作性、技能可编程化

📊 **数据：** 浏览 2569145 | 点赞 5419 | 转发 525

🔗 [查看原文](https://x.com/figma/status/2036434766661296602)

---

## 10. 最新消息：Nvidia（英伟达）$NVDA 首席执行官黄仁勋表示"我们已经实现了AGI（通用人工智能...

**来源：** @watcherguru

### 📝 原文

JUST IN: Nvidia $NVDA CEO Jensen Huang says "we've achieved AGI."

### 🌐 专业翻译

最新消息：Nvidia（英伟达）$NVDA 首席执行官黄仁勋表示"我们已经实现了AGI（通用人工智能）。"

### 🎯 核心发现

英伟达CEO黄仁勋公开宣称已实现AGI，这是AI芯片巨头首次做出如此激进的技术里程碑声明。考虑到英伟达在AI算力基础设施领域的主导地位，这一表态具有极强的市场信号意义。

### 💡 深度解读

这条推文需要在三个维度审慎解读：

**背景分析**：黄仁勋此番表态的时机值得关注。英伟达作为AI算力供应商，其GPU芯片支撑着OpenAI、Anthropic等头部AI公司的模型训练。这一声明可能基于其对客户最新模型能力的一手观察，也可能是为即将发布的新一代芯片（如Blackwell架构）造势。

**行业意义**：AGI的定义在学术界和产业界存在争议。如果黄仁勋指的是"在特定测试基准上达到人类水平"，这与真正的通用智能仍有距离。但作为产业领袖的表态，会直接影响资本市场对AI投资周期的判断，以及企业AI转型的紧迫感认知。

**为什么重要**：英伟达市值超过2万亿美元，其CEO的技术判断会影响整个科技板块估值逻辑。若市场相信AGI已至，将加速AI应用层投资，同时引发对AI监管、就业替代等社会议题的激烈讨论。但需警惕的是，这也可能是典型的"卖铲子者"营销策略——算力需求方越相信AGI临近，就越会增加芯片采购。

### 🔄 可迁移洞察

1. **技术供应商话语权**：掌握关键基础设施的企业，在定义技术成熟度上拥有超常影响力（类比：云服务商定义"云原生"标准）

2. **里程碑营销策略**：通过宣布突破性进展来重塑市场预期，适用于任何技术密集型行业的周期管理

3. **定义权之争**：AGI、量子优势、自动驾驶L5等概念的模糊性，使得"谁先宣布达成"成为战略博弈点

4. **产业链传导效应**：上游供应商的技术叙事如何快速传导至下游应用层和资本市场

🏷️ **标签：** AGI里程碑、算力话语权、技术叙事营销、AI产业周期、英伟达生态

📊 **数据：** 浏览 1225565 | 点赞 7302 | 转发 933

🔗 [查看原文](https://x.com/watcherguru/status/2036202494347321408)

---


*生成时间：2026-03-25 06:34:50*
