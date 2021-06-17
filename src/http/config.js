export default {
    //请求方式
    method: 'post',
    // 基础url前缀
    baseURL: '',
    // 请求头信息
    headers: {
      'Content-Type':'application/json;charset=UTF-8',
      // 'jwtAuth':'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0NTg3MzAiLCJjcmVhdGVkIjoxNjIxOTA2NTc3MzY3LCJleHAiOjE2MjE5OTI5NzcsImp0aSI6IjAyODI1MWQyLWRkZGYtNGQ3ZS1iYTNlLTgyY2U4YjQyYmQ2MyIsImdyb3VwQ29kZSI6IjAwMDAwMDAwMDAiLCJtYXBwaW5nUGF0aCI6Im5qdCJ9.Nw8YZZGGISdiIDUuR6xn-vX9B404JRdrSGTritMgitamrh1KK9ADYo97IXvDt04EBTe_PGGY7k37J4SVByH06A', 
      // 'mappingPath':'njt'
      // 'Content-Type':'application/x-www-form-urlencoded',
      // 'Appid': '123456',
      // 'Token': ''
    },
    // 参数
    data: {},
    // 设置超时时间
    timeout: 10000,
    // 携带凭证
    withCredentials: false,
    // 返回数据类型
    responseType: 'json',
    
}
