//TODO:make it cool http://html5demos.com/history
J(function($,p,pub){
	pub.id ="base";
	pub.userName = process.env['USERNAME'];
	pub.appRoot = process.execPath.substr(0,process.execPath.lastIndexOf('\\')+1);
	pub.dataRoot = pub.appRoot+"data\\fwspace\\";
	pub.initFile = pub.dataRoot+"app.ini";

	var gui = require('nw.gui'),
		fs = require('fs');
	
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

	pub.reload = function(){
		var win = gui.Window.get();
		win.reload();
	};

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

});