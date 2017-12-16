const readline = require('readline');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

var fileMap = fs.readdirSync(path.join('..','..','public','images','emoji'))
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
	const table = db.collection('emotion')
    table.insertMany(fileMap).then(() => db.close());
})
/**
 * 
 * {
	"_id" : ObjectId("59e4bb29334cbd3328f03b5d"),
	"tag" : "[亲亲]",
	"url" : "http://static.youku.com/ddshow/img/emoticons/511/f000.png",
	"active" : true,
	"id" : 0
}
 */