#!/bin/bash
if [ ! -n "$1" ]
    then 
    echo "==== 编译前端代码"
    webpack
    echo "==== 前端代码编译完成"
elif [ $1 == "server" ]
    then
    echo "==== 编译node.js服务器代码"
    tsc
    echo "==== 服务器代码编译完成"
elif [ $1 == "all" ]
    then
    echo "==== 编译全站代码"
    echo "(1.前端代码"
    webpack
    echo "(2.服务端代码"
    tsc
    echo "==== 全部代码编译完成"
fi