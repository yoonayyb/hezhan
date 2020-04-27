/**
 * 生产环境
 */
;
(function () {
  window.SITE_CONFIG = {}
  // API接口请求地址 本地版本
  window.SITE_CONFIG['baseUrl'] = 'http://gcapi.14.tx.demo.healthan.com.cn';

  //  设备的名字  (科达:Keda，远见:Fosiv)
  window.SITE_CONFIG['device'] = ''

  //  系统名字  
  window.SITE_CONFIG['orgName'] = '慢病管理平台'

  //  机构标识  (用于区分版本：区妇幼：qfy,百色：bs,梧州：wz) 
  window.SITE_CONFIG['orgflag'] = 'wz'
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
