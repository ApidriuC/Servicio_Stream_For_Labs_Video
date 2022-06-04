import axios, { AxiosResponse } from 'axios'
import '../config/dotenv'
const TOKEN = process.env.VAULT_TOKEN
import https from 'https'

export const queryVault = (uri: string) => {

  return new Promise((resolve, reject) => {
    const options = {
      headers:{
        'Authorization': `Bearer ${TOKEN}`
      },
      httpsAgent: new https.Agent({   
        rejectUnauthorized: false
      }),
    }
  
    axios.get(`${process.env.VAULT_HOST}${uri}`, options)
    .then((res:AxiosResponse) => {
      return resolve(res.data.data)
    })
    .catch((err: any) => reject(err))
  })
}
