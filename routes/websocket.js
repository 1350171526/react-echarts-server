const WebSocket = require('ws');
const axios = require('axios')

// 处理 WebSocket 连接
const handleWebSocket =  (server) => {
  const WebSocket = require('ws')

  const wss = new WebSocket.Server({ port: 3002 })

  // 创建连接池
  const connections = new Set();

  wss.on('connection', (ws) => {
    // 将新连接添加到连接池
    connections.add(ws);

    let cityCode;
    let timer = null;
    ws.on('message', message => {
      cityCode = +`${message}`
      console.log(`Received message => ${message}`)
      if(connections.size !== 0){
        timer = setInterval(async ()=>{
          const res = await getWeather(cityCode)
          connections.forEach((client) => {
            client.send(JSON.stringify(res));
          });
        },20000)
      }
    })
    
    ws.on('close', () => {
      clearInterval(timer);
      timer = null;
      console.log('Connection closed');
      // 从连接池中移除关闭的连接
      connections.delete(ws);
    });
  })
};

const getWeather = async (cityCode) => {
  try {
    const res = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
    params: {
      key: 'acca7d00d4361354f0f92e5452443bd4', 
      city: cityCode, 
      extensions: 'base' 
    }
    })
    return res.data.lives[0]
  }catch(error){
    // res.status(500).json({ error: 'An error occurred' });
    console.log( error+'An error occurred');
  }
}

module.exports = handleWebSocket;