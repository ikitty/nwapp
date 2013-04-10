J(function($,p,pub){

	pub.tName = 'Workspace';
    // add autoincrement by Enix
	// CREATE TABLE if not exists test (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name)
	pub.fields = [
		'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
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
			this.createTable = J.data.getTableSQL(pub.tName,pub.fields);
			this.getAll = J.data.getSelectSQL(pub.tName);
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
			userName:J.base.userName,
			createdAt:new Date().toString('yyyy-MM-dd HH:mm:ss'),
			modifiedAt:new Date().toString('yyyy-MM-dd HH:mm:ss')
		}
	};
	p.C = {
		initTable:function(){

			J.db.transaction(function(tx){
				tx.executeSql(p.sql.createTable,[],function(tx1){

					var sql = J.data.getInsertSQL(pub.tName,p.M.item0),
						data = J.data.objectToArray(p.M.item0);

					tx.executeSql(sql,data);
				});
				
			});
		},
		onLoad:function(){
			//init table when the ini file is a new one
			$(window).on(J.dataSetting.tName+'OnLoaded',function(e,d){\
				if (d.isNew) {
					p.C.initTable();
				};
			});
		}
	};

	/**
	 * 添加记录
	 */
	pub.insert = function(item){

		J.db.transaction(function(tx){

			item.userName = process.env['USERNAME'];
			item.createdAt = item.modifiedAt = new Date().toString('yyyy-MM-dd HH:mm:ss');

			var sql = J.data.getInsertSQL(pub.tName,item);

			tx.executeSql(sql,J.data.objectToArray(item),function(tx){
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
		J.db.transaction(function(tx){

			var sql = J.data.getSelectSQL(pub.tName,'rootPath = ?');

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
		J.db.transaction(function(tx){

			var sql = J.data.getSelectSQL(pub.tName,'id = ?');

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
		J.db.transaction(function(tx){

			var sql = J.data.getDeleteSQL(pub.tName,{'id':id});

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
		
		J.db.transaction(function(tx){

			item.modifiedAt = new Date().toString('yyyy-MM-dd HH:mm:ss');

			var item1 = J.data.objectToArray(item,['id']),
				sql = J.data.getUpdateSQL(pub.tName,item,'id');

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
		J.db.transaction(function(tx){

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

	pub.id="dataWorkspace";

	
});
