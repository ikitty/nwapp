JF.M("home",(function(){
	var p ={},pub={};

	pub.tName = 'home';

	p.M = {
		workspaceData:null
	};

	p.V = {
		$wsList:$("#wsList"),
		tplWSItem0:'<li>No Workspace</li>',
		tplWSItem:'<li id="wsItem%id%"><a href="#" rel="%id%">%name%</a></li>',
		fillWSList:function(d){
			if(d.cnt==0){
				this.$wsList.append(this.tplWSItem0);
				return;
			}
			var cnt = d.cnt,
				html = [];
			for (var i = cnt - 1; i >= 0; i--) {
				html.push(JF.EvalTpl(this.tplWSItem,d.items[i]));
			};
			this.$wsList.append(html.join(''));
		},
		fillCurWS:function(){
			$("#lblWorkspace").html(JF.base.curWorkspace?' -'+JF.base.curWorkspace.name:'');
			if (JF.base.curWorkspace) {
				this.resetWSList();
				$("#wsItem"+JF.base.curWorkspace.id).addClass('active');
				JF.dataProject.getAllByWorkspace(JF.base.curWorkspace.rootPath);
			};
		},
		resetWSList:function(){
			this.$wsList.find('li').removeClass('active');
		}
	};

	p.C = {
		init:function(){
			$(window).on(JF.dataWorkspace.tName+'OnGetAll',function(e,d){
				p.M.workspaceData = d;
				p.V.fillWSList(d);
				p.V.fillCurWS();
			});
		},
		onLoad:function(){
			p.V.$wsList.on("click","a",function(e){
				p.C.switchWorspace(this.rel);
				return false;
			});
		},
		switchWorspace:function(id){
			if (id == JF.base.curWorkspace.id) {
				return;
			};
			for (var i = p.M.workspaceData.cnt - 1; i >= 0; i--) {
				if (id == p.M.workspaceData.items[i].id) {
					JF.base.curWorkspace = p.M.workspaceData.items[i];
					break;
				};
			};
			p.V.fillCurWS();
		}
	};

	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};
	return pub;
})(jQuery));