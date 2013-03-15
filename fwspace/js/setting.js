JF.M("setting",(function($){
	var p ={},pub={};

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
			var tName = JF.dataSetting.tName;
			$(window).on(tName+'OnLoaded',function(e,d){
				p.V.render(JF.dataSetting.data);
			}).on(tName+"OnSavedError",function(e,d){
				JF.alert.show(d.toString(),{
					title:'Error when writing setting data!'
				});
				JF.base.hideTip();
			}).on(tName+"OnSaved",function(e,d){
				JF.base.hideTip();
				JF.alert.show('Successfully Saved!',{duration:1500});
			});
		},
		onLoad:function(){

			$("#btnSave").on('click',function(e){

				p.C.save();
				return false;

			});

		},
		save:function(){

			if(JF.base.isBusy()){
				return;
			}
		
			JF.base.showTip('Saving data...');
			var data = p.V.getData();

			JF.dataSetting.save(data);

		}
	};
	
	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};
	return pub;
})(jQuery));