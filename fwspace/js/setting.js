J(function($,p,pub){
	pub.id="setting";
	p.V = {
		$main:$("#frmMain"),
		$controlGroups:null,
		init:function(){
			this.$fields = this.$main.find('.field_item');
			this.$controlGroups = this.$main.find('.control-group');
			//文件夹路径
			$("#ipt_exeCss1").on("change",function(e){
				if (this.value.length>0) {
					document.getElementById(this.getAttribute('data-target')).value = this.value;
				};
			});
			$("#ipt_exeImg1").on("change",function(e){
				if (this.value.length>0) {
					document.getElementById(this.getAttribute('data-target')).value = this.value;
				};
			});
			$("#ipt_exeLess1").on("change",function(e){
				if (this.value.length>0) {
					document.getElementById(this.getAttribute('data-target')).value = this.value;
				};
			});



		},
		render:function(data){

			for (var c in data) {
				this.$fields.filter('.field_'+c).val(data[c]);
			};

		},
		reset:function(){
			this.$fields.each(function(i,o){
				$(o).val('');
			});
		},
		getData:function(){
			var data = {};
			this.$fields.each(function(i,o){
				data[o.name] = $.trim($(o).val());
			});

			return data;
		},
		resetValidation:function(){
			this.$controlGroups.removeClass('error');
		},
		validateError:function(fieldName){
			this.$controlGroups.filter('#cg_'+fieldName).addClass('error');
		}
	}	

	p.C = {
		init:function(){
			//监听事件
			var tName = J.dataSetting.tName;
			$(window).on(tName+'OnLoaded',function(e,d){
				p.V.render(J.dataSetting.data);
			}).on(tName+"OnSavedError",function(e,d){
				J.alert.show(d.toString(),{
					title:'Error when writing setting data!'
				});
				J.base.hideTip();
			}).on(tName+"OnSaved",function(e,d){
				J.base.hideTip();
				J.alert.show('Successfully Saved!',{duration:1500});
			});
		},
		onLoad:function(){

			$("#btnSave").on('click',function(e){

				p.C.save();
				return false;

			});

		},
		save:function(){

			if(J.base.isBusy()){
				return;
			}
		
			J.base.showTip('Saving data...');
			var data = p.V.getData();

			J.dataSetting.save(data);

		}
	};
	

});