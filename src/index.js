import { encode } from './base64';

const fs = wx.getFileSystemManager();

// 临时文件缓存
const tempFileMap = new Map();

// 同步 wx.downloadFile
const downloadFileSync = (url) => new Promise((resolve, reject) => {
  wx.downloadFile({
    url,
    success: resolve,
    fail: reject,
  });
});

Component({
  externalClasses: ['image-class'],
  properties: {
    src: String, // svg 资源地址，暂仅支持本地路径
    color: String, // svg 颜色
    colors: null, // svg 颜色配置，支持数组或对象
    mode: String, // svg 裁剪、缩放的模式
  },
  observers: {
    async 'src, color, colors'(src, color, colors) {
      try {
        if (color || (colors && (
          colors.length > 0 || Object.keys(colors).length > 0
        ))) {
          let data;
          // 网络资源下载，排除开发工具临时路径格式: http://tmp/
          if (/^http(s)?:\/\//.test(src) && !/^http:\/\/tmp\//.test(src)) {
            let tempFilePath = tempFileMap.get(src);
            try {
              if (!tempFilePath) throw tempFilePath;
              // 检查临时文件是否存在
              fs.accessSync(tempFilePath);
            } catch (err) {
              tempFilePath = (await downloadFileSync(src)).tempFilePath;
              // 缓存临时文件
              tempFileMap.set(src, tempFilePath);
            }
            data = fs.readFileSync(tempFilePath, 'utf8');
          } else {
            data = fs.readFileSync(src, 'utf8');
          }
          // eslint-disable-next-line no-param-reassign
          if (!colors) colors = {}; // 默认值
          if (/(fill|stroke)=".*?"/.test(data)) {
            let index = 0;
            data = data.replace(/(fill|stroke)=".*?"/g, (matched) => {
              // 获取原本颜色
              const matchedColor = matched.slice(matched.indexOf('"') + 1, -1);
              // 设置替换颜色
              const replaceColor = colors[index++] || colors[matchedColor] || color || matchedColor;

              if (/fill/.test(matched)) return `fill="${replaceColor}"`;
              if (/stroke/.test(matched)) return `stroke="${replaceColor}"`;
              return `fill="${replaceColor}"`;
            });
          }
          // 设置默认底色
          const defaultColor = colors['#000'] || colors['#000000'] || colors.black || color;
          // svg 标签是否包含底色
          if (defaultColor && !/fill=".*?"/.test(data.slice(0, data.indexOf('>')))) {
            data = data.replace(/<svg /, `<svg fill="${defaultColor}" `);
          }
          this.setData({
            base64: `data:image/svg+xml;base64, ${encode(data)}`,
          });
        } else {
          this.setData({
            base64: src,
          });
        }
      } catch (err) {
        console.error(err);
        this.triggerEvent('error', err);
      }
    },
  },
  data: {
    base64: '',
  },
  methods: {
    onImageError(e) {
      this.triggerEvent('error', e.detail);
    },
    onImageLoad(e) {
      this.triggerEvent('load', e.detail);
    },
  },
});
