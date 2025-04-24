# 线型光束甲烷探测系统代码片段

## 一、主要技术栈

- Vue3.4
- Vite5.0
- Vuex
- Vue-Router
- JavaScript

## 二、主要插件

- axios 网络请求库
- ECharts 可视化图标库

## 三、其他插件

- better-scroll 滚动美化工具
- xgPlayer HTML5视频播放器
- postcss-pxtorem px转Rem

## 四、项目细节

### 1. 实时数据

封装`/src/utils/useWebSocket.js`建立Socket长连接，并实现心跳，重连机制发送二进制压缩消息以及接受报警信息通过弹窗/声音/Windows系统托盘通知三种方式提醒

### 2. 实时预览海康威视监控画面并控制摄像头

对接[海康威视开放WebSDK](https://open.hikvision.com/download/5cda567cf47ae80dd41a54b3?type=10&id=4c945d18fa5f49638ce517ec32e24e24)，通过插件实现实时播放监控画面

### 3. 首页

1. 设备列表：点击场站中的区域切换监控
2. 监控窗口：根据用户设置的分屏类型（1*1，2*2，4*4）生成新的二维设备列表数组实现监控画面翻页

### 4. 8张项目截图
![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/1.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/2.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/3.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/4.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/5.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/6.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/7.png)

![image](https://github.com/zhuwenrui109/plumb-screenshort/blob/master/plumb-screenshort/8.png)
