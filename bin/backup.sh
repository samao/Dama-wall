#!/bin/bash
#备份数据了脚本
echo "*** 备份mg数据库 ***"
mongodump -o data/db_back
echo "*** 压缩备份文件 ***"
zip -r data/db.zip data/db_back/*
echo "*** 删除暂存文件 ***"
rm -r data/db_back
echo "*** 备份完毕 ***"