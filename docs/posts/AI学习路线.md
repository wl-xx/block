---
title: AI学习路线
description: AI学习路线
date: 2026-07-08
category: AI
tags:
  - AI
draft: false
---
# AI 工程师学习计划（前端工程师版，100 天）

## 目标

从前端工程师成长为 AI 应用工程师，能够独立开发 Agent、MCP Server、RAG
应用。

## 第一阶段（第1-14天）：AI 基础

### 学习目标

-   理解 LLM、Token、Context Window
-   Prompt Engineering
-   Chat API

### 学习内容

-   LLM 工作原理
-   Transformer（了解）
-   Token、Temperature、Top P
-   Prompt 五层结构
-   流式输出（Streaming）

### 实践

-   调用 OpenAI/Claude API
-   实现命令行聊天程序
-   实现 Web 聊天页面（Vue）

------------------------------------------------------------------------

## 第二阶段（第15-30天）：AI API 与 Tool Calling

### 学习内容

-   Responses API
-   Structured Output
-   Function Calling
-   JSON Schema

### 实践

-   天气工具
-   文件读取工具
-   Git 工具
-   多 Tool 协作

------------------------------------------------------------------------

## 第三阶段（第31-50天）：RAG

### 学习内容

-   Embedding
-   Chunk
-   向量数据库
-   检索策略

### 推荐数据库

-   Qdrant
-   Milvus

### 实践

-   PDF 知识库
-   Markdown 知识库
-   企业文档问答

------------------------------------------------------------------------

## 第四阶段（第51-70天）：Agent

### 学习内容

-   Planning
-   Memory
-   Reflection
-   Workflow

### 推荐框架

-   OpenAI Agents SDK
-   LangGraph

### 实践

-   自动写日报
-   自动整理 Issue
-   自动生成 PR

------------------------------------------------------------------------

## 第五阶段（第71-85天）：MCP

### 学习内容

-   MCP Host
-   MCP Client
-   MCP Server
-   Tool 定义

### 实践

开发 TypeScript MCP Server： - 查询课程 - 修改课程 - 查询 Git -
查询数据库

接入 Claude Code。

------------------------------------------------------------------------

## 第六阶段（第86-100天）：综合项目

开发 AI 课程助手：

功能： - 自然语言查询课程 - 自动修改课程 - 自动提醒 - RAG 查询课程说明 -
MCP 管理课程 - Agent 自动完成复杂任务

------------------------------------------------------------------------

# 推荐资源

## 官方文档

-   OpenAI Platform
-   Anthropic Docs
-   Model Context Protocol（MCP）
-   LangGraph

## 建议阅读顺序

1.  LLM 基础
2.  Prompt
3.  API
4.  Tool Calling
5.  RAG
6.  Agent
7.  MCP
8.  Workflow

## 每日建议

-   学习 1 小时
-   编码 1 小时
-   阅读源码或文档 30 分钟
-   总结笔记 15 分钟

## 最终能力

-   独立开发 AI Agent
-   编写 MCP Server
-   搭建企业 RAG
-   使用 TypeScript 开发 AI 应用
-   熟练使用 Claude Code、Codex 等 AI 开发工具
