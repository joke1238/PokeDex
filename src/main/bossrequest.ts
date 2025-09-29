import axios from 'axios';
import Hr from "./sign.js";

const instance = axios.create({
  baseURL: 'https://pokemmo.lanbizi.com/api', // 使用相对路径，让vite代理处理
  timeout: 3e4,
});


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });


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
              withCredentials: true,
          });
  
        //   console.log("Response data:", response.data);
  
          const msg = response.data?.msg || '';
  
          if (!response.data?.data) {
              console.warn("响应中没有 data 字段");
              return { data: [], msg };
          }
  
          // 解密数据
          const decryptedSign = sign.substring(0, 16);
          const decryptedData = Hr.AES.decrypt(
              response.data.data,
              Hr.enc.Utf8.parse(decryptedSign),
              {
                  iv: Hr.enc.Utf8.parse(decryptedSign),
                  mode: Hr.mode.CBC,
                  padding: Hr.pad.Pkcs7
              }
          ).toString(Hr.enc.Utf8);
  
        //   console.log("Decrypted raw data:", decryptedData);
  
          // 尝试解析 JSON
          let parsedData;
          try {
              parsedData = JSON.parse(decryptedData.trim());
          } catch (err) {
              console.error("解密后 JSON 解析失败:", err);
              parsedData = []; // 返回空数组
          }
  
        //   console.log("Parsed data:", parsedData);
          return { data: parsedData, msg };
  
      } catch (error) {
          console.error("获取数据失败:", error);
          return { data: [], msg: '获取数据失败' };
      }
  }

  export default getbossdata;