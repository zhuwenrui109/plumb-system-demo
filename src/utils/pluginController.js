const { WebVideoCtrl } = window;

//错误码        
//通用错误
const ERROR_CODE_UNKNOWN = 1000; //未知错误
const ERROR_CODE_NETWORKERROR = 1001; //网络错误
const ERROR_CODE_PARAMERROR = 1002; //缺少插件元素

//登录模块
const ERROR_CODE_LOGIN_NOLOGIN = 2000; // 未登录
const ERROR_CODE_LOGIN_REPEATLOGIN = 2001; //设备已登录，重复登录
const ERROR_CODE_LOGIN_NOSUPPORT = 2002; //当前设备不支持Digest登录

//预览播放
const ERROR_CODE_PLAY_PLUGININITFAIL = 3000; //插件初始化失败
const ERROR_CODE_PLAY_NOREPEATPLAY = 3001; //当前窗口已经在预览
const ERROR_CODE_PLAY_PLAYBACKABNORMAL = 3002; //回放异常
const ERROR_CODE_PLAY_PLAYBACKSTOP = 3003; //回放停止
const ERROR_CODE_PLAY_NOFREESPACE = 3004; //录像过程中，硬盘容量不足

/**
 * 初始化
 * @param {Object} options 设置
 * @returns Promise
 */
export const init = options => {
  return new Promise((resolve, reject) => {
    WebVideoCtrl.I_InitPlugin({
      ...options,
      cbInitPluginComplete: function () {
        WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin").then(() => {
          resolve();
        }, (err) => {
          console.log('err :>> ', err);
          reject(ERROR_CODE_PLAY_PLUGININITFAIL);
        });
      }
    });
  });
};

/**
 * 登录
 * @param {String} szIP 摄像头IP
 * @param {String} szPort 摄像头端口
 * @returns Promise
 */
export const login = (szIP, szPort) => {
  return new Promise((resolve, reject) => {
    if (!szIP || !szPort) {
      reject("szIP或szPort为空");
    }
    WebVideoCtrl.I_Login(szIP, 1, szPort, "admin", "abcd1234", {
      timeout: 3000,
      success: function () {
        console.log("登录成功！");
        resolve(`${szIP}_${szPort}`);
      },
      error: function (oError) {
        if (ERROR_CODE_LOGIN_REPEATLOGIN === status) {
          console.log(`${szIP}_${szPort}` + " 已登录过！");
          reject(ERROR_CODE_LOGIN_REPEATLOGIN);
        } else {
          console.log('oError :>> ', oError);
          reject(oError);
        }
      }
    });
  });
};

export const getDevicePort = (szDeviceIdentify) => {
  return new Promise((resolve, reject) => {
    if (!szDeviceIdentify) {
      reject("szDeviceIdentify为空");
    }
    WebVideoCtrl.I_GetDevicePort(szDeviceIdentify).then((oPort) => {
      // oPort.iDevicePort oPort.iRtspPort
      console.log("端口获取成功！");
      resolve(oPort);
    }, (oError) => {
      reject(oError);
    });
  });
};

export const getChannelInfo = (szDeviceIdentify) => {
  return new Promise((resolve, reject) => {
    if (!szDeviceIdentify) {
      reject("szDeviceIdentify为空");
    }
    WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
      success: function (xmlDoc) {
        console.log("通道获取成功！");
        resolve(xmlDoc);
      },
      error: function (oError) {
        reject(oError);
      }
    });
  });
};

export const startRealPlay = (szDeviceIdentify, options) => {
  return new Promise((resolve, reject) => {
    if (!szDeviceIdentify) {
      reject("szDeviceIdentify为空");
    }
    WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
      iStreamType: 1,
      iChannelID: 1,
      bZeroChannel: false,
      ...options,
      success: function () {
        console.log("开始预览成功！");
        resolve();
      },
      error: function (oError) {
        reject(oError);
      }
    });
  });
};

export const changeWndNum = (iType) => {
  return new Promise((resolve, reject) => {
    if (!iType) {
      reject("iType为空");
    }
    WebVideoCtrl.I_ChangeWndNum(parseInt(iType, 10)).then(() => {
      console.log("窗口分割成功！");
      resolve();
    }, (oError) => {
      reject(oError);
    });
  });
};

export const changeTxtWndNum = (iType) => {
  return new Promise((resolve, reject) => {
    if ("1*2" != iType) {
      reject("iType错误");
    }
    WebVideoCtrl.I_ArrangeWindow(iType).then(() => {
      console.log("窗口分割成功！");
      resolve();
    }, (oError) => {
      console.log("窗口分割失败！");
      reject("窗口分割失败！");
    });
  });
};

export const stopRealPlay = () => {
  WebVideoCtrl.I_StopAllPlay();
};

/**
 * 退出登录
 * @param {String} szIP 摄像头IP
 * @param {String} szPort 摄像头端口
 * @returns Promise
 */
export const logout = (szDeviceIdentify) => {
  return new Promise((resolve, reject) => {
    if (!szDeviceIdentify) {
      reject("szDeviceIdentify为空");
    }
    WebVideoCtrl.I_Logout(szDeviceIdentify).then(() => {
      console.log("退出成功！");
      resolve();
    }, () => {
      console.log("退出失败！");
      reject();
    });
  });
};

export const getInfo = index => WebVideoCtrl.I_GetWindowStatus(index);

export const destory = () => {
  WebVideoCtrl.I_DestroyPlugin();
};

export const getTextOverlay = (szUrl, szDeviceIdentify, deviceInfo) => {
  const info = checkDeviceInfo(deviceInfo);
  console.log('info :>> ', info);
  return new Promise((resolve, reject) => {
    WebVideoCtrl.I_GetTextOverlay(szUrl, szDeviceIdentify, {
      success: function (data) {
        $(data).find("TextOverlay").eq(0).find("displayText").eq(0).text(`${deviceInfo.station.name}-${deviceInfo.region.name}`);
        $(data).find("TextOverlay").eq(0).find("positionX").eq(0).text("20");
        $(data).find("TextOverlay").eq(0).find("positionY").eq(0).text("20");
        $(data).find("TextOverlay").eq(1).find("positionY").eq(0).text("5");

        $(data).find("TextOverlay").eq(1).find("displayText").eq(0).text(`浓度:${deviceInfo.gas}ppm.m`);
        $(data).find("TextOverlay").eq(1).find("positionX").eq(0).text("320");
        $(data).find("TextOverlay").eq(1).find("positionY").eq(0).text("5");

        $(data).find("TextOverlay").eq(2).find("displayText").eq(0).text(`光强:${deviceInfo.light}`);
        $(data).find("TextOverlay").eq(2).find("positionX").eq(0).text("520");
        $(data).find("TextOverlay").eq(2).find("positionY").eq(0).text("5");
        var xmldoc = toXMLStr(data);
        var newOptions = {
          type: "PUT",
          data: xmldoc,
          success: function () {
            console.log("绘制osd信息成功");
            resolve();
          },
          error: function (oError) {
            console.log("设置osd信息失败！");
            reject();
          }
        };

        WebVideoCtrl.I_SendHTTPRequest(szDeviceIdentify, szUrl, newOptions);
      },
      error: function (oError) {
        console.log("设置osd信息失败！");
        reject();
      }
    });
  });
};

function checkDeviceInfo(deviceInfo) {
  const info = {...deviceInfo};
  if (info.station.name.length > 6) {
    const name = info.station.name.slice(0, 6)
    console.log('info.station.name :>> ', name);
    info.station.name = name + "...";
  }
  if (info.region.name.length > 6) {
    const name = info.region.name.slice(0, 7)
    info.region.name = name + "...";
  }
  return info;
}

function toXMLStr(oXmlDoc) {
  var szXmlDoc = "";

  try {
    var oSerializer = new XMLSerializer();
    szXmlDoc = oSerializer.serializeToString(oXmlDoc);
  } catch (e) {
    try {
      szXmlDoc = oXmlDoc.xml;
    } catch (e) {
      return "";
    }
  }
  if (szXmlDoc.indexOf("<?xml") == -1) {
    szXmlDoc = "<?xml version='1.0' encoding='utf-8'?>" + szXmlDoc;
  }

  return szXmlDoc;
}