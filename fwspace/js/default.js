JF.M("home",(function(){
	var p ={},pub={};
	
	p= {
		V:{

		},
		M:{
			defaultTitle:'Notice',
			duration:0,
			timer:null
		},
		C:{
			onLoad:function(){

			}
		}
	};

	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};
	return pub;
})(jQuery));