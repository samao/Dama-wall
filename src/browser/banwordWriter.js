const readline = require('readline');
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/dama', (err,db) => {
	if(err){
		console.err(err)
		return;
	} 

	const table = db.collection('sensitive')

	const rl = readline.createInterface({
		input:fs.createReadStream('chinese_dictionary.txt')
	})

	const banwords = [];

	rl.on('line',word => {
		console.log(`当前行：${word}`)
		banwords.push({word,owner:'admin'})
	}).on('close',() => {
		console.log('===检查完毕')
		table.insertMany(banwords).then(()=> {
			console.log('写入完成');
			db.close();
		},reason => console.log(reason));
	})
})