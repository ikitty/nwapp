J(function($,p,pub){
	pub.id ="home";
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
				html.push(J.evalTpl(this.tplWSItem,d.items[i],true));
			};
			this.$wsList.append(html.join(''));
		},
		fillCurWS:function(){
			$("#lblWorkspace").html(J.base.curWorkspace?' -'+J.base.curWorkspace.name:'');
			if (J.base.curWorkspace) {
				this.resetWSList();
				$("#wsItem"+J.base.curWorkspace.id).addClass('active');
				J.dataProject.getAllByWorkspace(J.base.curWorkspace.rootPath);
			};
		},
		resetWSList:function(){
			this.$wsList.find('li').removeClass('active');
		}
	};

	p.C = {
		init:function(){
			$(window).on(J.dataWorkspace.tName+'OnGetAll',function(e,d){
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
			if (id == J.base.curWorkspace.id) {
				return;
			};
			for (var i = p.M.workspaceData.cnt - 1; i >= 0; i--) {
				if (id == p.M.workspaceData.items[i].id) {
					J.base.curWorkspace = p.M.workspaceData.items[i];
					break;
				};
			};
			p.V.fillCurWS();
		}
	};

});