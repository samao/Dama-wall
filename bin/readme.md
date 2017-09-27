# Mac OS 系统脚本

#### 1. `backup.sh`

备份并压缩mongodb,备份文件路径 ![data/db.zip](../data/db.zip)

#### 2. `begin.sh` 

`git pull`拉取代码。启动mongodb，恢复导入备份数据库。

#### 3. `build.sh`

  a). 无参数，编译前端代码
  
  b). `server`，编译服务器代码
  
  c). `all` ，编译全部代码

#### 4. `install.sh`

安装全局和项目依赖,全局依赖 `webpack`,`typescript`

#### 5. `restore.sh`

解压备份数据库，导入运行的mongodb，丢弃新数据 `mongorestore --drop`

#### 6. `start.sh`

运行node.js服务器,启动文件 `dist/server/index.js`

#### 7. `push.sh`

提交推送本地代码，参数为提交信息

#### 8. `complete.sh`

备份数据库，所有变更（包括代码）推送到github，参数是提交信息

#### 9. `reset.sh`

`git checkout -f` 强制检出当前版本代码，然后重重数据库
