//TODO:make it cool http://html5demos.com/history
J(function($,p,pub){
	pub.id ="base";
	pub.userName = process.env['USERNAME'];
	pub.appRoot = process.execPath.substr(0,process.execPath.lastIndexOf('\\')+1);
	pub.dataRoot = pub.appRoot+"data\\fwspace\\";
	pub.initFile = pub.dataRoot+"app.ini";

	var gui = require('nw.gui'),
		fs = require('fs-extra');

	pub.gui = gui;
	pub.fs =fs;
	
	p.V = {
		tpl0:'Welcome',
		$status:$("#appStatus"),
		$tip:$("#appTip"),
		$navCollapse:$("#navCollapse"),
		$secA:$("#secA"),
		updateStatus:function(txt){
			txt = txt||this.tpl0+','+pub.userName;
			this.$status.html(txt);
		}
	};

	p.M={
		tipTimer:null,
		isBusy:false
	};

	p.C={
		onLoad:function(){

			$("#btnClose").on("click",function(e){

				var win = gui.Window.get();
				win.close();
				return false;

			});

			$("#btnFullscreen").on("click",function(e){
				var win = gui.Window.get();
				win.toggleFullscreen();
				
				return false;
			});

			$("#btnMinSize").on("click",function(e){
				var win = gui.Window.get();
				win.minimize();
				return false;
			});

			$("#btnNavbar").on("click",function(e){

				if (p.V.$navCollapse.hasClass('in')) {
					p.V.$secA.removeClass('sec_collapsein');
				}else{
					p.V.$secA.addClass('sec_collapsein');
				};

			});

			//minimize to tray
			this.initTray();

		},
		initTray:function(){
			// Reference to window and tray
			var win = gui.Window.get(),
				tray;

			// Get the minimize event
			win.on('minimize', function() {
				// Hide window
				this.hide();

				// Show tray
				tray = new gui.Tray({ 
					'icon': 'icon.png'
				});
				tray.tooltip = 'HostSpirit';
				// Show window and remove tray when clicked
				tray.on('click', function() {
					win.show();
					this.remove();
					tray = null;
				});
			});
		}//initTray
	};
	/**
	 * 重载当前窗口
	 */
	pub.reload = function(){
		var win = gui.Window.get();
		win.reload();
	};
	/**
	 * 在页脚状态栏显示提示信息
	 * @param {String} txt 提示信息
	 * @param {int} timeout 提示显示时长
	 */
	pub.showTip = function(txt,timeout){
		clearTimeout(p.M.tipTimer);
		p.V.$tip.html(txt).show();
		p.M.isBusy=true;
		if (!timeout) {
			return;
		};
		p.M.tipTimer = setTimeout(function(){

			pub.hideTip();

		},timeout);
	};
	pub.hideTip = function(){
		clearTimeout(p.M.tipTimer);
		p.V.$tip.hide();
		p.M.isBusy = false;
	};

	pub.isBusy = function(){
		return p.M.isBusy;
	};
	/**
	 * update status bar
	 * @param {String} txt text info
	 */
	pub.updateStatus = function(txt){
		p.V.updateStatus(txt);
	};
	/**
	 * 获取文件的扩展名
	 * @param {String} filePath 文件路径
	 */
	pub.getFileExt = function(filePath){
		var ext = filePath.substr(filePath.lastIndexOf('.')+1);
		return ext;
	};

	/**
	* 指定的文件是否是图片
	* @public
	* @function
	* @name J.base#isImg
	* @param {String} file 文件路径
	*/
	pub.isImg = function(file) {
	    file = file.toLowerCase();
	    var isImg = false;
	    var arrImg = ['.jpg','.png','.gif','.jpeg'];
	    for (var i = 0; i < arrImg.length; i++) {
	        isImg = (file.substr(file.lastIndexOf(arrImg[i])) == arrImg[i]);
	        if (isImg) {
	            break;
	        }
	    }
	    return isImg;
	};

});
