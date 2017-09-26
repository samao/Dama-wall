#!/bin/bash
echo "==== 安装项目依赖"
echo "全局工具安装"
npm install -g webpack typescript
echo "项目模块安装"
npm install
echo "==== 依赖安装完成"