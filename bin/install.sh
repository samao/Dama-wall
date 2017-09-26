#!/bin/bash
echo "==== 安装项目依赖"
echo "(1.全局工具安装"
sudo npm install -g webpack typescript
echo "(2.项目模块安装"
npm install
echo "==== 依赖安装完成"