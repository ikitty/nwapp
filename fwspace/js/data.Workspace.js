JF.M("dataWorkspace",(function($){
	var p ={},pub={}, fs = require('fs');
	pub.tName = 'Workspace';
    // add autoincrement by Enix
	// CREATE TABLE if not exists test (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name)
	pub.fields = ['id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
		'name',
		'rootPath',
		'remotePath',
		'ftpId',
		'ftpPort',
		'ftpUser',
		'ftpPwd',
		'userName',
		'createdAt',
		'modifiedAt'
	];

	p.sql={
		createTable:'',
		getAll:'',
		init:function(){
			this.createTable = JF.data.getTableSQL(pub.tName,pub.fields);
			this.getAll = JF.data.getSelectSQL(pub.tName);
		}
	};
	p.M = {
		item0:{
            // remove id (id is autoincrement) by Enix
            // modify test case
			name:'测试',
			rootPath:'E:\\icson\\',
			remotePath:'/test/ic/',
			ftpId:'1.1.1.1',
			ftpPort:'1234',
			ftpUser:'uName',
			ftpPwd:'uPwd',
			userName:process.env['USERNAME'],
			createdAt:new Date().toString('yyyy-MM-dd HH:mm:ss'),
			modifiedAt:new Date().toString('yyyy-MM-dd HH:mm:ss')
		}
	};
	p.C = {
		initTable:function(){
			JF.db.transaction(function(tx){
				tx.executeSql(p.sql.createTable,[],function(){
                    // check why cannot i  get the data

                    var whereSql = JF.data.getSelectSQL(pub.tName);
					tx.executeSql(whereSql, [], function (tx, ret) {
                        // 如果数据库中有记录就不插入默认数据
                        if (ret.rows.length < 1) {
                            var sql = JF.data.getInsertSQL(pub.tName,p.M.item0),
                                data = JF.data.objectToArray(p.M.item0);

                            tx.executeSql(sql,data);
                        }
					});
				});
				
			});
		},
        // modify onload to init by Enix , initTable should be first , then do getAll
		init:function(){
			this.initTable();
		}
	};

	/**
	 * 添加记录
	 */
	pub.insert = function(item){

		JF.db.transaction(function(tx){

			item.userName = process.env['USERNAME'];
			item.createdAt = item.modifiedAt = new Date().toString('yyyy-MM-dd HH:mm:ss');

			var sql = JF.data.getInsertSQL(pub.tName,item);

			tx.executeSql(sql,JF.data.objectToArray(item),function(tx){
				$(window).trigger(pub.tName+'OnInserted',[item]);
			},function(tx,err){
				$(window).trigger(pub.tName+'OnInsertedError',[err]);
			});
			

		});
	};

	/**
	 * 根据rootPath自段获取记录
	 */
	pub.findByRootPath = function(rootPath,cbk){
		JF.db.transaction(function(tx){

			var sql = JF.data.getSelectSQL(pub.tName,'rootPath = ?');

			tx.executeSql(sql,[rootPath],function(tx,results){

				$(window).trigger(pub.tName+'OnFindByRootPath',[results]);

				cbk && cbk(results);

			});

		});
	};

	/**
	 * 根据id自段获取记录
	 */
	pub.findById = function(id,cbk){
		JF.db.transaction(function(tx){

			var sql = JF.data.getSelectSQL(pub.tName,'id = ?');

			tx.executeSql(sql,[id],function(tx,results){

				$(window).trigger(pub.tName+'OnFindById',[results]);

				cbk && cbk(results);

			});

		});
	};
	/**
	 * 删除记录
	 */
	pub.deleteById = function(id){
		JF.db.transaction(function(tx){

			var sql = JF.data.getDeleteSQL(pub.tName,{'id':id});

			tx.executeSql(sql,[id],function(tx){

				$(window).trigger(pub.tName+'OnDeletedById',[id]);

			},function(tx,err){
				$(window).trigger(pub.tName+'OnDeletedByIdError',[id]);
			});

		});
	};

	/**
	 * 更新记录
	 */
	pub.update = function(item){
		
		JF.db.transaction(function(tx){

			item.modifiedAt = new Date().toString('yyyy-MM-dd HH:mm:ss');

			var item1 = JF.data.objectToArray(item,['id']),
				sql = JF.data.getUpdateSQL(pub.tName,item,'id');

			item1.push(item.id);

			tx.executeSql(sql,item1,function(tx){
				$(window).trigger(pub.tName+'OnUpdated',[item]);
			},function(tx,err){
				$(window).trigger(pub.tName+'OnUpdatedError',[err]);
			});

		});
	};

	/**
	 * 获取所有记录
	 */
	pub.getAll = function(){
		JF.db.transaction(function(tx){

			tx.executeSql(p.sql.getAll,[],function(tx,results){

				var items = [],
					len = results.rows.length;
				if (len>0) {
					for (var i = len - 1; i >= 0; i--) {
						items.push(results.rows.item(i));
					};
				};

				$(window).trigger(pub.tName+'OnGetAll',[{'cnt':len,'items':items}]);

			},function(tx,err){
				$(window).trigger(pub.tName+'OnGetAllError',[err]);
			});

		});
	};

	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};


	return pub;
})(jQuery));
