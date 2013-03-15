JF.M("about",(function(){
	var p ={},pub={},
		gui = require('nw.gui');
	
	p.C= {
		onLoad:function(){

			JF.base.showTip('FWS V'+JF.data.version);
			$("#txtVersion").html(JF.data.version);

			$("#aboutBody").on("click","a",function(e){

				gui.Shell.openExternal(this.href);

				return false;

			});
		}
	};
	
	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};
	return pub;
})(jQuery));