import instance from "@renderer/request/lanbizi_request";
import Hr from "@renderer/utils/sign.js";

async function getbossdata() {
    try {
        const timestamp = new Date().getTime();
        const path = '/monster/alpha/preview' + timestamp;
        const sign = Hr.MD5(path).toString();

        // 发送请求
        const response = await instance.post("/monster/alpha/preview", {}, {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                "Origin": "https://pokemmo.lanbizi.com",
                "Referer": "https://pokemmo.lanbizi.com/",
                "Sec-Ch-Ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Sign": sign,
                "Timestamp": timestamp,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0"
            },
            withCredentials: true,  // 允许发送 Cookie
        });

        // 打印响应数据以便调试
        console.log("Response data:", response.data);

        // 解密数据
        const decryptedSign = sign.substring(0, 16);
        const decryptedData = Hr.AES.decrypt(
            response.data.data,  // 确保 response.data.data 存在且是加密的字符串
            Hr.enc.Utf8.parse(decryptedSign),
            {
                iv: Hr.enc.Utf8.parse(decryptedSign),
                mode: Hr.mode.CBC,
                padding: Hr.pad.Pkcs7
            }
        ).toString(Hr.enc.Utf8);

        // 解析 JSON 数据
        const parsedData = JSON.parse(decryptedData);
        return parsedData;
    } catch (error) {
        console.error("获取数据失败:", error);
        throw error;
    }
}

export default getbossdata;
