import qrcode from './qrcode';
import barcode from './barcode';
 
// 插件内部是根据width, height参数的rpx值来进行绘画
// 把数字转换成条形码
function toBarcode (canvasId, code, width, height) {
    barcode.code128(canvasId, code, width, height);
}
 
// 把数字转换成二维码
function toQrcode (canvasId, code, width, height) {
  console.log("开始",canvasId)
    qrcode.api.draw(code, {
        ctx: canvasId,
        width,
        height
    })
}
 
export {
    toBarcode,
    toQrcode
}