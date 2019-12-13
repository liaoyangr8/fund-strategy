
import axios from 'axios'
import * as fs from 'fs'

interface FundDataItem {
  date: string
  val: number
  accumulatedVal: number
  growthRate: number
  bonus: number
}

/**
 * 拉取数据, 260108
 */
const getFundData = async (fundCode: string|number, size?: number)=>{
  const page = 1
  const pageSize = size || 1000
  const path = `http://api.fund.eastmoney.com/f10/lsjz?callback=jQuery&fundCode=${fundCode}&pageIndex=${page}&pageSize=${pageSize}&startDate=&endDate=&_=${Date.now()}`
  const resp = await axios.get(path, {
    headers: {
      Cookie: `st_si=72802706700422; st_asi=delete; qgqp_b_id=3ca196226cbb6079aabc858881141a7d; EMFUND1=null; EMFUND2=null; EMFUND3=null; EMFUND4=null; st_pvi=62789366621137; st_sp=2019-03-07%2000%3A52%3A33; st_inirUrl=http%3A%2F%2Ffund.eastmoney.com%2F519019.html; st_sn=16; st_psi=20191205233019665-112200304021-5991783587; EMFUND0=null; EMFUND5=12-05%2020%3A36%3A23@%23%24%u5149%u5927%u6C38%u946B%u6DF7%u5408A@%23%24003105; EMFUND6=12-05%2020%3A38%3A33@%23%24%u9E4F%u534E%u5F18%u8FBE%u6DF7%u5408A@%23%24003142; EMFUND7=12-05%2020%3A39%3A04@%23%24%u4FE1%u8FBE%u6FB3%u94F6%u65B0%u80FD%u6E90%u4EA7%u4E1A%u80A1%u7968@%23%24001410; EMFUND8=12-05%2022%3A03%3A49@%23%24%u4EA4%u94F6%u7ECF%u6D4E%u65B0%u52A8%u529B%u6DF7%u5408@%23%24519778; EMFUND9=12-13 00:36:25@#$%u666F%u987A%u957F%u57CE%u65B0%u5174%u6210%u957F%u6DF7%u5408@%23%24260108`,
      Host: `api.fund.eastmoney.com`,
      Referer: `http://fundf10.eastmoney.com/jjjz_260108.html`,
      'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36`

    }
  })

  const result:string = resp.data

  const jsonIndex = 'jQuery('.length
  const jsonStr = result.slice(jsonIndex, -1)
  let json = JSON.parse(jsonStr)
  const historyVal = json.Data.LSJZList // 历史净值
  // 日期    FSRQ，  date
  // 单位净值 DWJZ，  val
  // 累计净值 LJJX，  accumulatedVal
  // 日增长率 JZZZL   growthRate
  // 分红送配 FHFCZ  bonus

  console.log(historyVal[0])
  return historyVal.map(item => {
    return {
      date: item.FSRQ,
      val: item.DWJZ,
      accumulatedVal: item.LJJZ,
      growthRate: item.JZZZL,
      bonus: item.FHFCZ
    } as FundDataItem
  })
}

/**
 * 保存为 json 文件
 */
const genrateFundJsonFile = (list:FundDataItem[], filePath: string)=>{
  try {
    fs.writeFileSync(filePath, JSON.stringify({list}))
  } catch (err) {
    console.error(err)
  }
}


const main = async ()=>{
  const list = await getFundData('260108')
  genrateFundJsonFile(list, './static/景顺长城260108.json')
}
main()


