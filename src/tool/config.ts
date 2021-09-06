//公共路径
const httpUrl = process.env.UMI_ENV === "prod" ? "http://47.108.158.162/api" : "http://127.0.0.1:7001/" ;

export {
	httpUrl
};