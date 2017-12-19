/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:27:35 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-19 12:30:50
 */

 //----表情写入工具

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

var fileMap = fs.readdirSync(path.join('public','images','emoji'))
fileMap = fileMap.filter(e => e.includes('.png')).map((e,index) => ({
    tag:`[${e.replace('.png','')}]`,
    url:`http://localhost:3000/static/images/emoji/${e}`,
    active:true,
    id:index
}));

MongoClient.connect('mongodb://localhost:27017/dama', (err,db) => {
	if(err){
		console.err(err)
		return;
	} 
	const table = db.collection('emotion');
    table.insertMany(fileMap).then(() => db.close()).then(() => console.log('写入完毕'));
})