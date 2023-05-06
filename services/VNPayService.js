import dateFormat from "dateformat";
import querystring from "qs";
import crypto from "crypto";
// const calculatorVoucher = require("../utils/calculatorVoucher");
// const { orderService, orderDetailService, voucherService } = require("./index");

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}

const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

export const createPaymentUrl = async (req) => {
    try {
        const {
            amount = 5000,
            bankCode = "NCB",
            orderInfo = "Thanh toan don hang",
            code = null,
        } = req.body;
        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURNURL;

        const date = new Date();

        const createDate = dateFormat(date, "yyyymmddHHmmss");
        const orderId = dateFormat(date, "HHmmss") + date.getTime();

        const locale = req.body.language;
        if (locale === null || locale === "") {
            locale = "vn";
        }
        const orderType = "billpayment";
        const currCode = "VND";
        let vnp_Params = {};

        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_OrderType"] = orderType;
        vnp_Params["vnp_Amount"] = amount * 100;

        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        console.log(vnpUrl);
        return {
            vnpUrl,
            orderId,
            amount,
        };
    } catch (err) {
        console.log(err);
    }
};

export const vnpReturn = async (req) => {
    let vpnParams = req.query;
    const secureHash = vpnParams["vnp_SecureHash"];

    delete vpnParams["vnp_SecureHash"];
    delete vpnParams["vnp_SecureHashType"];

    vpnParams = sortObject(vpnParams);

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;

    const signData = querystring.stringify(vpnParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        return {
            code: vpnParams["vnp_ResponseCode"],
            message: "Giao dịch thành công",
        };
    } else {
        return {
            code: 97,
            message: "Giao dịch thất bại",
        };
    }
};
