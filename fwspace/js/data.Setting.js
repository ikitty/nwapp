JF.M("dataSetting",(function($){
	var p ={},pub={},
		fs = require('fs-extra'),
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

	p.C = {
		onLoad:function(){

			fs.exists(JF.base.initFile,function(exists){

				if (!exists) {

					fs.mkdirs(JF.base.dataRoot,function(err){
						if(err){
							console.log(err);
							return;
						};
						fs.writeFile(JF.base.initFile,JSON.stringify(pub.data),function(err){
							$(window).trigger(pub.tName+"OnLoaded",[{
								isOk:true
							}]);
						});

					});
					

					return;
				};

				JF.base.showTip('Load Config data...');

				fs.readFile(JF.base.initFile,function(err,data){

					JF.base.hideTip();

					if(err) {
						$(window).trigger(pub.tName+"OnLoaded",[{
							'err':err
						}])
						return;
					}

					data = JSON.parse(data.toString());

					JF.dataSetting.data = data;

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

		fs.writeFile(JF.base.initFile,txt,function(err){
			if (err) {

				$(window).trigger(pub.tName+"OnSavedError",[err]);
				return;
			};

			$(window).trigger(pub.tName+"OnSaved",[item]);

			JF.dataSetting.data = item;

		});
	};

	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};


	return pub;
})(jQuery));