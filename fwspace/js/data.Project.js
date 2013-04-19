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

			fs.writeFile(p.M.dataFile,JSON.stringify(p.M.items),function(err){
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
			$win.trigger(pub.id+'OnSaved',[{isOk:false,err:'Project directly exists:'+_dir}]);
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

			fs.readFile(file,function(err,data){

				J.base.hideTip();

				if(err) {
					$win.trigger(pub.id+"OnDataLoaded",[{
						'isOk':false,
						'err':err
					}]);
					return;
				}

				data = JSON.parse(data.toString());

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
		if (workspacePath) {
			alert('TODO:显示指定workspace的项目'+workspacePath);
		};
		
	};
	/**
	 * Get project files from specified project directory
	 * @param {String} _dir project directory
	 */
	pub.getFiles = function(_dir){
		alert('TODO:加载项目文件'+_dir);
	};

    /**
     * 根据项目路径(CSS)获取各类型文件
     *
     * @author alextang
     * @param {String} path 项目路径，如：E:/icson/css/common
     * @return return something
     **/
	pub.getProjectFile = function(path, ns){
        if (!path) {
            return  ;
        }
        // TODO get lv type data : searchTag
        // make path
        var pathType = ['html', 'css', 'img', 'psd'],
            ns = ns || '',
            xPath ;

        for (var i = 0, k = null; k = pathType[i] ; i++ ) {
            xPath = path.replace('css', k);
            (function (k) {
                fs.readdir(xPath, function(err,files){
                    if (!err) {
                        console.log('pub getProjectFile:', files);
                        $(window).trigger(pub.tName+'OnGetProjectFile' + ns, {'type': k, 'items': files});
                    };
                });
            })(k);
        }
	};

});
