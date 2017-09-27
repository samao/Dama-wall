#!/bin/bash
echo "=== 暂时关闭数据库"
brew services stop mongodb
echo "==== 拉取最新代码"
git checkout -f
echo "==== 删除数据库"
rm -r data/db
mkdir data/db
echo "==== 重启数据库"
brew services start mongodb
. bin/restore.sh