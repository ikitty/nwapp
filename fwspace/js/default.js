J(function($,p,pub){
	pub.id ="home";

	var $win = $(window),
		g_clActive = 'active',
		T = Mustache,
		cprocess = require('child_process');

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
			this.curProjectIdx = parseInt(J.dbLocal[pub.id+'.curProjectIdx'])||0;
			this.curWorkspaceId = parseInt(J.dbLocal[pub.id+'.curWorkspaceId'])||0;
		},
		reset:function(){
			this.curWorkspace = this.curWorkspace0;
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
		},
        firstUpper: function (v) {
            return v.slice(0,1).toUpperCase() + v.slice(1) ;
        }

	};

	p.V = {
		$wsList:$("#wsList"),
		$wsOption:$("#wsOption"),
		tplWSItem0:'<li id="wsItem0"><a href="#" rel="0">Show All</a></li>',
		tplWSItem:'<li id="wsItem%id%"><a href="#" rel="%id%">%name%</a></li>',
		//fill workspace switch list
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
		}
	};

	p.C = {
		init:function(){
			$win.on(J.dataWorkspace.id+'OnGetAll',function(e,d){
				p.M.workspaceData = d;
				p.V.fillWSList(d);
				p.M.setCurrentWorkspace();
				//p.V.fillCurWS();
				J.base.updateStatus("Total workspace:"+d.cnt);

				//get project list
				J.dataProject.getAll();

			}).on(J.dataWorkspace.id+'OnDataInited',function(e){
				//get workspace data
				J.dataWorkspace.getAll();
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
			tplNavItem:'<li id="projectItem%id%"><a id="project%id%" rel="%id%" href="#projectPanel%id%" data-toggle="tab" data-path="%path%">%name%</a></li>',
			tplNoProject:'<li id="alertNoProject"><div class="alert alert-error alert_noproject">No Projects found!</div></li>',
			tplProjectPanel:'<div id="projectPanel%id%" class="tab-pane"></div>',
			tplProjectDir:document.getElementById('tplProjectDir').innerHTML,
			$projectNavList:$("#projectNavList"),
			$projectPanelList:$("#projectPanelList"),
			$projectMain:$("#projectMain"),
			fillFiles:function(d){
				//d.errCode为1时为目录不存在，为2时目录读取失败
				if ( (!d.isOk) && (d.errCode==1) ) {
					return;
				};

				if (!d.isOk) {
					d.errStr = d.err.toString();
				};
				
				var panel =document.getElementById('projectPanel'+p.M.curProjectIdx);

				html = T.render(this.tplProjectDir,d);

				panel.innerHTML+=html;

				panel.setAttribute('data-loaded','1');
			}
		},
		init:function(){
			$win.on(J.dataProject.id+'OnDataLoaded',function(e,d){
				if (!d.isOk) {
					J.alert.show('Error on '+J.dataProject.id+'OnDataLoaded!',{duration:2500});
					console.log(d.err);
					return;
				};
				p.project.fillProjects(d.data);
				p.C.switchWorspace(p.M.curWorkspaceId);
				
			}).on(J.dataProject.id+'OnSaved',function(e,d){
				p.project.onProjectSaved(d);
			}).on(pub.id+'OnSwitchWorkspace',function(e,d){
				p.project.filterByWorkspace();
			}).on(J.dataDir.id+'OnGetFiles',function(e,d){
				p.project.V.fillFiles(d);
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
				return false;
			});
			//add a project folder
			$("#ipt_projectFolder").on('change',function(e){
				if (this.value.length>0) {
					p.project.addProject(this.value);
				};
			});

			this.V.$projectNavList.on('click','a',function(e){
				p.project.selectProject({
					'idx':this.rel,
					'path':this.getAttribute('data-path')
				});
				return false;
			});

			$("#projectPanelList").on('click','a',function(e){
				p.project.openFile(this.getAttribute('data-path'));
				return false;
			});

		},
		filterByWorkspace:function(){
			var items = J.dataProject.filterByWorkspace(p.M.curWorkspace.rootPath);
			//init folder for input[type='file']：NOTE：nw v5.0后支持
			$("#ipt_projectFolder").attr('nwworkingdir',p.M.curWorkspace.rootPath||'');
			this.fillProjects(items);
			this.initSelected();
		},
		//fill projects
		fillProjects:function(data){
			var len =0;
			this.V.$projectNavList.empty();
			this.V.$projectPanelList.empty();
			
			if ((len=data.length)==0) {
				this.V.$projectNavList.html(this.V.tplNoProject);
				return;
			};
			var html = [],htmlPanel=[];
			for (var i = len - 1; i >= 0; i--) {
				html.push(J.evalTpl(this.V.tplNavItem,data[i],true));
				htmlPanel.push(J.evalTpl(this.V.tplProjectPanel,data[i],true));
			};
			this.V.$projectNavList.append(html.join(''));
			this.V.$projectPanelList.append(htmlPanel.join(''));
		},
		initSelected:function(){
			$('#project'+p.M.curProjectIdx).trigger('click');
		},
		selectProject:function(obj){
			$("#projectItem"+p.M.curProjectIdx+","+'#projectPanel'+p.M.curProjectIdx).removeClass(g_clActive);
			J.dbLocal[pub.id+'.curProjectIdx']=p.M.curProjectIdx = parseInt(obj.idx);
			//Menu state
			$("#projectItem"+obj.idx).addClass(g_clActive);
			//Panel state
			var $panel = $('#projectPanel'+p.M.curProjectIdx);
			$panel.addClass(g_clActive);
			//Tip state
			document.getElementById('projectTip').innerHTML = obj.path;
			//检测是否已经读取
			if ($panel.attr('data-loaded')!=='1') {
				J.dataProject.getFiles(obj.path);
				return;
			};
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
		openFile:function(filePath){
			//获取配置的程序
			var exe = J.dataSetting.getExeByFile(filePath);
			if ( (!exe) || (exe.length==0) ) {
				//系统默认打开方式
				J.base.gui.Shell.openItem(filePath);
				return;
			};
			//TODO:fix bugs here
			cprocess.exec(exe,filePath);
		}//openFile
	};

});