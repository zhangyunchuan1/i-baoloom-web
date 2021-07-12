import { notification } from 'antd';

/**
 * 颜色转换
 * @param { string } type //类型枚举：[ 'HEX', 'hex', 'RGB', 'RGBA' ];
 */
export const formatColor = (type: string, color: string) => {
  let outColor = '';
  //先确定颜色类型
  let valueType = colorType(color);
  if (type == 'HEX') {
    if (valueType == 'HEX') {
      outColor = color;
    } else if (valueType == 'hex') {
      outColor = '#' + color;
    } else if (valueType == 'RGB') {
      outColor = rgbToHex(color, 'HEX');
    } else if (valueType == 'RGBA') {
      outColor = rgbaToHEX(color, 'HEX');
    }
  } else if (type == 'hex') {
    if (valueType == 'HEX') {
      outColor = color.substr(1);
    } else if (valueType == 'hex') {
      outColor = color;
    } else if (valueType == 'RGB') {
      outColor = rgbToHex(color, 'hex');
    } else if (valueType == 'RGBA') {
      outColor = rgbaToHEX(color, 'hex');
    }
  } else if (type == 'RGB') {
    if (valueType == 'HEX') {
      outColor = colorRgbOrRgba(color, 'RGB');
    } else if (valueType == 'hex') {
      outColor = colorRgbOrRgba(color, 'RGB');
    } else if (valueType == 'RGB') {
      outColor = color;
    } else if (valueType == 'RGBA') {
      outColor = rgbaToRgb(color);
    }
  } else if (type == 'RGBA') {
    if (valueType == 'HEX') {
      outColor = colorRgbOrRgba(color, 'RGBA');
    } else if (valueType == 'hex') {
      outColor = colorRgbOrRgba(color, 'RGBA');
    } else if (valueType == 'RGB') {
      outColor = rgbToRgba(color);
    } else if (valueType == 'RGBA') {
      outColor = color;
    }
  }

  return outColor;
};

/**
 * 获取颜色类型
 * @param { string } type //类型枚举：[ 'HEX', 'hex', 'RGB', 'RGBA' ];
 * 判断规则： 色值带‘#’的为“HEX”, 色值不带‘#’的为“hex”, 色值带‘RBG’的为“RGB”, 色值带‘RGBA’的为“RGBA”
 */
export const colorType = (color: string) => {
  let type = '';
  if (color.match(RegExp(/#/))) {
    type = 'HEX';
  } else if (color.match(RegExp(/RGBA/)) || color.match(RegExp(/rgba/))) {
    type = 'RGBA';
  } else if (color.match(RegExp(/RGB/)) || color.match(RegExp(/rgb/))) {
    type = 'RGB';
  } else {
    type = 'hex';
  }
  return type;
};

//HEX/hex转RGB
const colorRgbOrRgba = (color: string, type: string) => {
  //type :要输出的类型  RGB / RGBA
  let _color = colorType(color) == 'HEX' ? color : '#' + color;
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  _color = _color.toLowerCase();
  if (reg.test(_color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (_color.length === 4) {
      var colorNew = '#';
      for (var i = 1; i < 4; i += 1) {
        colorNew += _color.slice(i, i + 1).concat(_color.slice(i, i + 1));
      }
      _color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + _color.slice(i, i + 2)));
    }
    if (type == 'RGBA') {
      return 'rgba(' + colorChange.join(',') + ', 1.0)';
    } else {
      return 'rgb(' + colorChange.join(',') + ')';
    }
  } else {
    return _color;
  }
};

//rgba转hex / HEX
const rgbaToHEX = (color: any, type: string) => {
  //type 输出类型 hex / HEX
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  var a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  if (type == 'hex') {
    return (
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2)
    );
  } else {
    return (
      '#' +
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2)
    );
  }
};

//rgb转hex / HEX
const rgbToHex = (color: string, type: string) => {
  //type :要输出的类型  HEX / hex
  // RGB颜色值的正则
  var reg = /^(rgb|RGB)/;
  if (reg.test(color)) {
    var strHex = type == 'HEX' ? '#' : '';
    // 把RGB的3个数值变成数组
    var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    // 转成16进制
    for (var i = 0; i < colorArr.length; i++) {
      var hex = Number(colorArr[i]).toString(16);
      if (hex === '0') {
        hex += hex;
      }
      strHex += hex;
    }
    return strHex;
  } else {
    return String(color);
  }
};

//rgba转rgb
const rgbaToRgb = (color: any) => {
  let rgbaAttr = color.match(/[\d.]+/g);
  if (rgbaAttr.length >= 3) {
    var r, g, b;
    r = rgbaAttr[0];
    g = rgbaAttr[1];
    b = rgbaAttr[2];
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  return '';
};

// rgb转rgba
const rgbToRgba = (color: any) => {
  let rgbaAttr = color.match(/[\d.]+/g);
  if (rgbaAttr.length >= 3) {
    let r, g, b;
    r = rgbaAttr[0];
    g = rgbaAttr[1];
    b = rgbaAttr[2];
    return 'rgba(' + r + ',' + g + ',' + b + ',' + '1.0' + ')';
  }
  return '';
};

/**
 * toast 提示
 *
 */

export class Toast {
  static success(content: string, title?: string) {
    if (content) {
      notification.success({
        message: title,
        description: content,
        placement: 'bottomRight',
      });
    }
  }
  static info(content: string, title?: string) {
    if (content) {
      notification.info({
        message: title,
        description: content,
        placement: 'bottomRight',
      });
    }
  }
  static warning(content: string, title?: string) {
    if (content) {
      notification.warning({
        message: title,
        description: content,
        placement: 'bottomRight',
      });
    }
  }
  static error(content: string, title?: string) {
    if (content) {
      notification.error({
        message: title,
        description: content,
        placement: 'bottomRight',
      });
    }
  }
}
