//用户相关的请求模块
import request from "@/utils/request"

/* 用户登录 */
export const loginApi = ({ mobile, code }) => {
    return request(
        {
            method: 'POST',
            url: '/v1_0/authorizations',
            data: {
                mobile,
                code
            }
        }
    )
}