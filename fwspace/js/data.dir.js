/*
 * J.dataDir - 目录操作模块
 */
J(function($,p,pub){

	pub.id = "dataDir";

	var fs = require('fs-extra'),
		$win = $(window);

	p.getFiles = function(_dir,_includeSubDir){

		fs.exists(_dir,function(yes){
			if (!yes) {
				$win.trigger(pub.id+'OnGetFiles',[{
					isOk:false,
					'err':'Directory Not Exists:'+_dir,
					'errCode':1,
					path:_dir
				}]);
				return;
			};

			fs.readdir(_dir,function(err,files){
				if (err) {
					$win.trigger(pub.id+'OnGetFiles',[{
						isOk:false,
						'err':err,
						'errCode':2,
						path:_dir
					}]);
					return;
				};
				//console.log(files);
				var d = {
					isOk:true,
					path:_dir,
					files:[],
					folders:[]
				},stat = null,
					len2 = files.length;

				for (var i = len2 - 1; i >= 0; i--) {
					stat = fs.lstatSync(_dir+files[i]);
					//directory
					if (stat.isDirectory()) {
						d.folders.push(_dir+files[i]+'\\');
						if (_includeSubDir) {
							p.getFiles(_dir+files[i]+'\\',_includeSubDir);
						};
						continue;
					};
					if (!stat.isFile()) {
						continue;
					};
					//file
					d.files.push(_dir+files[i]);
				};

				$win.trigger(pub.id+'OnGetFiles',[d]);

			});//fs.readdir

		});//fs.exists

	};


	/*
	 * Get all files in specifed directory
	 * @param {String} _dir directory
	 * @param {String} _includeSubDir whether including the sub-direcoties
	 */
	pub.getFiles = function(_dir,_includeSubDir){
		p.getFiles(_dir,_includeSubDir)
	};

});