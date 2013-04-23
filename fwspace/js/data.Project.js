J(function($,p,pub){
	pub.id="dataProject";
	
	var fs = require('fs-extra'),
		path = require('path'),
		$win = $(window);

	p.M={
		dataFile : J.base.dataRoot+'Project.json',
		items:[]//project items
	};

	p.C={
		//save a project instance
		save:function(d,isInit){

			var cnt = p.M.items.length;
			for (var i = 0; i < cnt; i++) {
				p.M.items[i].id = i+1;
			};

			if (d) {
				d.id = cnt+1;
				p.M.items.push(d);
			};

			fs.writeJson(p.M.dataFile,p.M.items,function(err){
				var isOk =true;
				if (err) {
					isOk = false;
				};
				var data ={
					isOk:isOk,
					isInit:isInit,
					err:err,
					data:p.M.items,
					item:d
				};
				$win.trigger(pub.id+"OnSaved",[data]);

				if (isInit) {
					$win.trigger(pub.id+"OnDataLoaded",[data]);
				};

			});
		},
		//remove a project
		remove:function(_dir){
			if (!pub.exists(_dir)) {
				return;
			};
			var items = [],
				len = p.M.items.length;

			for (var i = len - 1; i >= 0; i--) {
				if (p.M.items[i].path!==_dir) {
					items.push(p.M.items[i]);
				};
			};

			p.M.items = items;
			this.save(d,false);
		}
	};


	/**
	 * Add a directory as project
	 * @param {String} _dir directly
	 */
	pub.addDirAsProject=function(_dir){

		if (pub.exists(_dir)) {
			$win.trigger(pub.id+'OnSaved',[{isOk:false,err:'Project directory exists:'+_dir}]);
			return;
		};

		var tempDir = _dir;

		if (J.endsWidth(_dir,'\\')) {
			tempDir = tempDir.substr(0,tempDir.length-1);
		}else{
			_dir+='\\';
		};

		var d = {
			path:_dir
		};
		//get project name
		d.name = tempDir.substr(tempDir.lastIndexOf('\\')+1);
		//created at
		d.createdAt = new Date().toString('yyyy-MM-dd HH:mm:ss');

		p.C.save(d,false);

	};

	/**
	 * Whether a project exists
	 * @param {String} _dir project directory
	 */
	pub.exists = function(_dir){
		var yes = false,
			len = p.M.items.length;

		_dir = J.endsWidth(_dir,'\\')?_dir:(_dir+'\\');

		for (var i = len - 1; i >= 0; i--) {
			if (p.M.items[i].path==_dir) {
				yes=true;
				break;
			};
		};
		return yes;
	};

	/**
	 * Get all working projects
	 */
	pub.getAll = function(){
		var file =p.M.dataFile;
		fs.exists(file,function(exists){

			if (!exists) {

				p.C.save(null,true);

				return;
			};

			J.base.showTip('Load Project data...');

			fs.readJson(file,function(err,data){

				J.base.hideTip();

				if(err) {
					$win.trigger(pub.id+"OnDataLoaded",[{
						'isOk':false,
						'err':err
					}]);
					return;
				}

				p.M.items = data;

				$win.trigger(pub.id+"OnDataLoaded",[{'isOk':true,'data':data}]);

			});

		});
	};

	/**
	 * show projects in specified workspace
	 * @param {String} workspacePath workspace path
	 */
	pub.filterByWorkspace = function(workspacePath){

		if (!workspacePath) {
			return p.M.items;
		};

		var items = p.M.items,
			len = items.length,
			items1 = [];
		for (var i = 0; i < len; i++) {
			if (items[i].path.indexOf(workspacePath)==0) {
				items1.push(items[i]);
			};
		};
		return items1;
		
	};
	/**
	 * Get project files from specified project directory
	 * @param {String} _dir project directory
	 */
	pub.getFiles = function(_dir){
		fs.exists(_dir,function(yes){
			if (!yes) {
				$win.trigger(pub.id+'OnGetFiles',[{
					isOk:false,
					'err':'Directory not exists!'+_dir
				}]);
				return;
			};

			//read all files according to the J.dataSetting.data.searchFlag
			fs.readdir(_dir,function(err,files){
				if (err) {
					$win.trigger(pub.id+'OnGetFiles',[{
						isOk:false,
						'err':err
					}]);
					return;
				};
				//console.log(files);
				var d = {
					folders:[]
				},
					flags = J.dataSetting.data.searchFlag,
					len1 = flags.length,
					len2 = files.length,
					stat = null;
				for (var i = len1- 1; i >= 0; i--) {
					d[flags[i]] = [];
				};
				//TODO:
				for (var j = len2 - 1; i >= 0; i--) {
					stat = fs.lstatSync(files[j]);
					//directory
					if (stat.isDirectory()) {
						d.folders.push(_dir+'\\'+files[j]+'\\');
						continue;
					};
					if (!stat.isFile()) {
						continue;
					};
					//file
					
					for (var i = len1 - 1; i >= 0; i--) {
						if ( (_dir+'\\'+files[j]).indexOf('\\'+flags[i]+'\\') > -1 ) {
							d[flags[i]].push(_dir+'\\'+files[j]);
							break;
						};
					};

				};
			});
		});
	};

});