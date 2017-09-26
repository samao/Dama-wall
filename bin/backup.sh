#!/bin/bash
#备份数据了脚本
echo "*** 备份mg数据库 ***"
mongodump -o data/db_back
echo "*** 压缩备份文件 ***"
zip -r data/db.zip data/db_back/*
echo "*** 删除暂存文件 ***"
rm -r data/db_back
echo "*** 备份完毕 ***"
echo "=== 提交备份到github ==="
#定义时间
now=`date`
git add --all
git commit -a --message "'数据库备份：'$now"
git push origin master
echo '数据库推送github 完成'$now