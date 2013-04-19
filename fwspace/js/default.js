J(function($,p,pub){
	pub.id ="home";

	var $win = $(window);

	p.M = {
		workspaceData:null,
		curProjectIdx:0,
		curWorkspaceId:0,
		curWorkspace0:{
			id:0,
			name:'All'
		},
		init:function(){
			this.reset();
			this.curProjectIdx = J.dbLocal[pub.id+'.curProjectIdx'] || 0;
			this.curWorkspaceId = J.dbLocal[pub.id+'.curWorkspaceId']||0;
		},
		},
		setCurrentWorkspace:function(){
			var cnt = this.workspaceData.length;
			if (cnt>0&&this.curWorkspaceId!==0) {
				
				for (var i = cnt - 1; i >= 0; i--) {
					if (this.workspaceData[i].id==this.curWorkspaceId) {
						this.curWorkspace = this.workspaceData[i];
						break;
					};
				};

				return;
			};

			this.reset();
        }
	};

	p.V = {
		$wsList:$("#wsList"),
		$projectList:$("#projectNavList"),
		$wsOption:$("#wsOption"),
		tplWSItem0:'<li id="wsItem0"><a href="#" rel="0">Show All</a></li>',
		tplWSItem:'<li id="wsItem%id%"><a href="#" rel="%id%">%name%</a></li>',
		fillWSList:function(d){
			this.$wsList.append(this.tplWSItem0);
			var cnt = d.cnt,
                htmlOption = '',
				html = [];
			for (var i = cnt - 1; i >= 0; i--) {
				html.push(J.evalTpl(this.tplWSItem,d.items[i],true));
                htmlOption += '<option value="' + d.items[i].rootPath + '">' + d.items[i].name + '</option>' ;
			};
			this.$wsList.append(html.join(''));
			this.$wsOption.html(htmlOption);
		},
		//switch to specified workspace
		switchWS:function(ws){

			p.M.curWorkspace =ws;

			$("#lblWorkspace").html('-'+ws.name);
			this.resetWSList();
			$("#wsItem"+ws.id).addClass('active');
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
			$win.on(J.dataWorkspace.id+'OnGetAll',function(e,d){
				p.M.workspaceData = d;
				p.V.fillWSList(d);
				p.M.setCurrentWorkspace();
				//p.V.fillCurWS();
                // 填充所有项目
				//get project list

			});

            // bind event for get all
			p.V.$projectList.on("click", "li", function(e){
				JF.dataProject.getProjectFile($(this).html() );
			});
		},
		onLoad:function(){
			p.V.$wsList.on("click","a",function(e){
				e.preventDefault();
				if (p.M.curWorkspaceId==parseInt(this.rel)) {
					return;
				};

				p.C.switchWorspace(this.rel);

			});
		},
		switchWorspace:function(id){

			var wsObj = p.M.curWorkspace0;

			if (id!==0) {
				for (var i = p.M.workspaceData.cnt - 1; i >= 0; i--) {
					if (id == p.M.workspaceData.items[i].id) {
						wsObj = p.M.workspaceData.items[i];
						break;
					};
				};
			};

			p.M.curWorkspaceId=J.dbLocal[pub.id+'.curWorkspaceId'] = wsObj.id;

			p.V.switchWS(wsObj);

			$win.trigger(pub.id+'OnSwitchWorkspace');

		}
	};

	p.project={
		V:{
			tplNavItem:'<li><a id="project%id%" rel="%id%" href="#%name%" data-toggle="tab" data-path="%path%">%name%</a></li>',
			$projectNavList:$("#projectNavList")
		},
		init:function(){
			$win.on(J.dataProject.id+'OnDataLoaded',function(e,d){
				if (!d.isOk) {
					J.alert.show('Error on '+J.dataProject.id+'OnDataLoaded!',{duration:1500});
					console.log(d.err);
					return;
				};
				p.project.fillProjects(d.data);
				p.C.switchWorspace(p.M.curWorkspaceId);
				p.project.initSelected();
			}).on(J.dataProject.id+'OnSaved',function(e,d){
				p.project.onProjectSaved(d);

			}).on(pub.id+'OnSwitchWorkspace',function(e,d){
				p.project.filterByWorkspace();
			});
		},
		onLoad:function(){
			$('#fanMenu').fanmenu({
				'initAngle':30/*(Starting Angle in degree)*/,
				'angleDisplay' : 60/*(Displacement angle in degree)*/,
				'hideOnClick':true,
				'radius':100/*(circle radius in px)*/,
			});
			$('#fanMenuList').on('click','a',function(e){
				if (this.rel=="1") {
					p.project.openDir();
					return false;
				};
				if (this.rel=="2") {
					p.project.openForm();
					return false;
				};
				return false;
			});
			//add a project folder
			$("#ipt_projectFolder").on('change',function(e){
				if (this.value.length>0) {
					p.project.addProject(this.value);
				};
			});

			this.V.$projectNavList.on('click','a',function(e){
				J.dbLocal[pub.id+'.curProjectIdx']=p.M.curProjectIdx = parseInt(this.rel);
				J.dataProject.getFiles(this.getAttribute('data-path'));
				return false;
			});
		},
		filterByWorkspace:function(){
			J.dataProject.filterByWorkspace(p.M.curWorkspace.rootPath);
			//init folder for input[type='file']：NOTE：nw v5.0后支持
			$("#ipt_projectFolder").attr('nwworkingdir',p.M.curWorkspace.rootPath||'');
		},
		//fill projects
		fillProjects:function(data){
			var len =0;
			if ((len=data.length)==0) {
				$("#projectMain").addClass('project_none');
				return;
			};
			for (var i = len - 1; i >= 0; i--) {
				this.V.$projectNavList.append(J.evalTpl(this.V.tplNavItem,data[i],true));
			};
		},
		initSelected:function(){
			$('#project'+p.M.curProjectIdx).trigger('click');
		},
		onProjectSaved:function(d){
			if (!d.isOk) {
				J.alert.show(d.err.toString());
				return;
			};

			this.V.$projectNavList.append(J.evalTpl(this.V.tplNavItem,d.item,true));
		},
		openDir:function(d){
			$("#ipt_projectFolder").trigger('click',[d]);
		},
		addProject:function(_dir){

			J.dataProject.addDirAsProject(_dir);

		},
		openForm:function(){
			alert('TODO:create New Project');
		}
	};

});