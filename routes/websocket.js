const WebSocket = require('ws');
const axios = require('axios')

// 处理 WebSocket 连接
const handleWebSocket =  (server) => {
  const WebSocket = require('ws')

  const wss = new WebSocket.Server({ port: 3002 })

  wss.on('connection', (ws) => {
    let cityCode;
    ws.on('message', message => {
      cityCode = +`${message}`
      console.log(`Received message => ${message}`)
    })
    setInterval(async ()=>{
      const res = await getWeather(cityCode)
      ws.send(JSON.stringify(res))
    },20000)
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
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = handleWebSocket;