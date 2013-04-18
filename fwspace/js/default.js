JF.M("home",(function(){
	var p ={},pub={};

	pub.tName = 'home';

	p.M = {
		workspaceData:null,
        firstUpper: function (v) {
            return v.slice(0,1).toUpperCase() + v.slice(1) ;
        }
	};

	p.V = {
		$wsList:$("#wsList"),
		$projectList:$("#projectNavList"),
		$wsOption:$("#wsOption"),
		tplWSItem0:'<li>No Workspace</li>',
		tplWSItem:'<li id="wsItem%id%"><a href="#" rel="%id%">%name%</a></li>',
        // 填充所有ws列表（填充给首页和新项目的浮层页）
		fillWSList:function(d){
			if(d.cnt==0){
				this.$wsList.append(this.tplWSItem0);
				return;
			}
			var cnt = d.cnt,
                htmlOption = '',
				html = [];
			for (var i = cnt - 1; i >= 0; i--) {
				html.push(JF.EvalTpl(this.tplWSItem,d.items[i]));
                htmlOption += '<option value="' + d.items[i].rootPath + '">' + d.items[i].name + '</option>' ;
			};
			this.$wsList.append(html.join(''));
			this.$wsOption.html(htmlOption);
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
		},

        // 填充当前工作空间下的所有项目
        fillProject: function (d) {
			var html = [];
            // to obj
            var ret = [] ;
            for (var i = 0, k = null; k = d[i] ; i++ ) {
                ret.push({'projectFullPath': k.path, 'projectName': k.name});
            }

            for (i = 0, k = null; k = ret[i] ; i++ ) {
				html.push(JF.EvalTpl(this.tplProjectItem, k));
            }

			this.$projectList.html(html.join(''));
        },

        // 填充当前项目下各类型文件
        fillProjectFile: function (d) {
			var html = '';

            for (var i = 0, k = null; k = d.items[i] ; i++ ) {
                html += '<li>' + k + '</li>' ;
            }
            $('#project' + p.M.firstUpper(d.type)).html(html);
        }
	};

	p.C = {
		init:function(){
			$(window).on(JF.dataWorkspace.tName+'OnGetAll',function(e,d){
				p.M.workspaceData = d;
				p.V.fillWSList(d);
				p.V.fillCurWS();
			}).on(JF.dataProject.tName + 'OnGetProject', function (e, d) {
                // 填充所有项目
				p.V.fillProject(d);
			}).on(JF.dataProject.tName + 'OnGetProjectFile', function (e, d) {
                // 填充选中项目下的各类型文件
			    p.V.fillProjectFile(d); 
			});

            // bind event for get all
			p.V.$projectList.on("click", "li", function(e){
				JF.dataProject.getProjectFile($(this).html() );
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
