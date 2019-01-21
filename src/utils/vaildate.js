/**
 */
export default {
  //为空
  isEmpty:(obj)=>{
      return (obj === "" || obj === undefined || obj === null) ? true : false;
  },
  //不为空
  isNotEmpty:(obj)=>{
      return (obj === "" || obj === undefined || obj === null) ? false : true;
  },
  //是否为邮箱
  isEmail:(str)=>{
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/i;
      return reg.test(str.trim());
  },
  //是否小写字母
  isLowerCase:(str)=> {
      const reg = /^[a-z]+$/;
      return reg.test(str);
  },
  //是否为大写字母
  isUpperCase:(str)=> {
      const reg = /^[A-Z]+$/;
      return reg.test(str);
  },
  //判断输入的字符是否为英文字母
  isLetter:(str)=>{
      str = str.trim();
      if(str.length!==0){
          let reg=/^[a-zA-Z]+$/;
          return reg.test(str);
      }
  },
  //是否为数组
  isArr:(arg)=>{
      if(typeof Array.isArray==="undefined") {
          return Object.prototype.toString.call(arg)==="[object Array]"
      }
  },
  //是否为正整数
  isInt:(arg)=> {
      arg.trim();
      if (arg.length !== 0) {
          let reg = /^[-+]?\d*$/;
          return reg.test(arg);
      }
  },
  //是否为双精度
  isDouble:(arg)=>{
      arg = arg.trim();
      if(arg.length){
          let reg=/^[-\+]?\d+(\.\d+)?$/;
          return reg.test(arg);
      }
  },
  //判断输入的字符是否为:a-z,A-Z,0-9
  isString:(arg)=> {
      arg = arg.trim();
      if (arg.length) {
          let reg = /^[a-zA-Z0-9_]+$/;
          return reg.test(arg);
      }
  },
  //是否为中文
  isCh:(arg)=>{
      arg = arg.trim();
      if (arg.length) {
          let reg=/^[\u0391-\uFFE5]+$/;
          return reg.test(arg);
      }
  },
  //手机号
  isMobile:(phoneValue)=>{
      phoneValue = phoneValue.trim();
      var reg = /^[1][0-9]{10}$/;
      return reg.test(phoneValue);
  },
  //座机号
  isTel:(tel)=>{
      var reg = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
      tel = tel.trim();
      return reg.test(tel);
  },
  //身份证号
  isIdcard(card) {
      card = card.trim();
      if(card) {
          // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
          var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/;
          return reg.test(card);
      }
  },
  //银行卡号
  isBtCard:num=> {
      num = num.trim();
      if(num) {
          let reg = /^(998801|998802|622525|622526|435744|435745|483536|528020|526855|622156|622155|356869|531659|622157|627066|627067|627068|627069)\d{10}$/;
          reg.test(num);
      }
  },
  //url
  isUrl: val=>{
      val = val.trim();
      if(val) {
          let reg = "^[a-zA-z]+://(\\\\w+(-\\\\w+)*)(\\\\.(\\\\w+(-\\\\w+)*))*(\\\\?\\\\S*)?$";
          return reg.test(val);
      }
  }
};


