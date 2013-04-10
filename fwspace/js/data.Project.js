J(function($,p,pub){
	pub.id="dataProject";
	
	var fs = require('fs-extra'),
		path = require('path');

	/**
	 * 获取所有的项目。COC规则：寻找css文件夹，取其父文件夹作为项目文件夹
	 * @param {String} workspacePath 工作空间的绝对路径
	 */
	pub.getAllByWorkspace = function(workspacePath){
		fs.readdir(workspacePath, function(err,files){
			if (!err) {
				console.log(files);
			};
		});
	};
});