#!/bin/bash
#定义时间
git add --all
git commit -a --message "$1"
git push origin master
now=`date`
echo '数据库推送github 完成.'$now