#!/bin/bash
#恢复数据库脚本
echo "减压数据库备份"
unzip data/db.zip
echo "导入备份数据库"
mongorestore --drop --dir data/db_back
rm -r data/db_back
echo "*** 恢复完毕 ***"