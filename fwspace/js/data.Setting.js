/**
 * application setting module
 */
J(function($,p,pub){
	var fs = require('fs-extra'),
		path = require('path');

	p.M = {
		item0:{
			'exeCss':'',
			'exeImg':'',
			'exeLess':'',
			'createdAt':new Date().toString('yyyy-MM-dd HH:mm:ss'),
			'modifiedAt':new Date().toString('yyyy-MM-dd HH:mm:ss')
		}
	};

	pub.tName = "Setting";
	pub.data = p.M.item0;

	//controller
	p.C = {
		init:function(){

			fs.exists(J.base.initFile,function(exists){

				if (!exists) {

					fs.mkdirs(J.base.dataRoot,function(err){
						if(err){
							console.log(err);
							return;
						};
						fs.writeFile(J.base.initFile,JSON.stringify(pub.data),function(err){
							$(window).trigger(pub.tName+"OnLoaded",[{
								isOk:true,
								isNew:true
							}]);
						});

					});
					

					return;
				};

				J.base.showTip('Load Config data...');

				fs.readFile(J.base.initFile,function(err,data){

					J.base.hideTip();

					if(err) {
						$(window).trigger(pub.tName+"OnLoaded",[{
							'err':err
						}])
						return;
					}

					data = JSON.parse(data.toString());

					J.dataSetting.data = data;

					$(window).trigger(pub.tName+"OnLoaded",[{isOk:true}]);

				});

			});
		}
	};
	/**
	 * 更新记录
	 */
	pub.save = function(item){
		
		item = $.extend({},pub.instance,item||{});

		var txt = JSON.stringify(item);

		fs.writeFile(J.base.initFile,txt,function(err){
			if (err) {

				$(window).trigger(pub.tName+"OnSavedError",[err]);
				return;
			};

			$(window).trigger(pub.tName+"OnSaved",[item]);

			J.dataSetting.data = item;

		});
	};
	pub.id="dataSetting";
	
});