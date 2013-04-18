JF.M("dataProject",(function($){
	var p ={},pub={},
		fs = require('fs-extra'),
		path = require('path');

	pub.tName = 'Project';

    // TODO 从lv的数据中读取所有项目信息
	/**
	 * 获取所有的项目。COC规则：寻找css文件夹，取其父文件夹作为项目文件夹
	 * @param {String} workspacePath 工作空间的绝对路径
	 */
	pub.getAllByWorkspace = function(workspacePath){
		fs.readdir(workspacePath, function(err,files){
			if (!err) {
                $(window).trigger(pub.tName+'OnGetProject', [files]);
			};
		});
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

	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};


	return pub;
})(jQuery));
