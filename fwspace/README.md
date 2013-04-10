fwspace
=======

## 页面加载时的数据流程

1. **dataSetting模块初始化 - 判断app.ini文件是否存在，不存在2，存在3
2. **创建app.ini文件
3. **触发window的dataSettingOnLoaded事件，如果2被成功执行，传递数据{isNew:true,isOk:true}，否则isNew为false
4. **dataWorkspace模块监听window的dataSettingOnLoaded事件，如果isNew为true转5，否则6
5. **初始化SQLlite数据库，创建表Workspace，并且插入初始数据，
6. **dataWorkspace模块触发window的dataWorkspaceOnDataInited事件

到了第6步，说明app.ini文件已经ok，sqlite数据库创建完毕，并且初始化数据完毕！

所以，所有页面的入口，应该监听window的dataWorkspaceOnDataInited事件，在事件处理函数中进行
页面逻辑处理。