

let lastest_update_time = undefined

//函数
//=================
function csvToJson(csv) {
    let raws = csv.split('\n')
    let headers = raws[0].split(',')
    let json = []
    for (let i = 1; i < raws.length; i++) {
        if (!raws[i]) {
            continue
        }
        let obj = {}
        let cells = raws[i].split(',')
        for (let j = 0; j < headers.length; j++) {
            console.log(cells[j])
            obj[headers[j]] = cells[j]
        }
        json.push(obj)
    }
    return json
}


/**
 * 多账号玩家映射（小号=>大号）
 */
let mapping = {
    "伊小鹤": "伊纸鹤",
    "牵着窝仔去旅行":"WoZai",
    "乂孒":"灯華",
    "曦辉":"灯華"
}

function calc(list) {
    let dict = {}
    for (data of list) {
        // console.log(data)
        calcData(data, dict)
    }
    return dict
}

function calcData(data, dict) {
    let uid_1 = data['1位昵稱']?data['1位昵稱']:data['1位昵称']
    let pt_1 = Number(data['1位得分'])
    let uid_2 = data['2位昵稱']?data['2位昵稱']:data['2位昵称']
    let pt_2 = Number(data['2位得分'])
    let uid_3 = data['3位昵稱']?data['3位昵稱']:data['3位昵称']
    let pt_3 = Number(data['3位得分'])
    let uid_4 = data['4位昵稱']?data['4位昵稱']:data['4位昵称']
    let pt_4 = Number(data['4位得分'])
    let flying = pt_4 < -40
    let u1 = dictGet(dict, mappingUser(uid_1))
    let u2 = dictGet(dict, mappingUser(uid_2))
    let u3 = dictGet(dict, mappingUser(uid_3))
    let u4 = dictGet(dict, mappingUser(uid_4))
    userAccrue(u1, "1位", pt_1)
    userAccrue(u2, "2位", pt_2)
    userAccrue(u3, "3位", pt_3)
    userAccrue(u4, flying ? "击飞" : "4位", pt_4)
    let finish_time = new Date(data['結束時間']?data['結束時間']:data['结束时间'])
    lastest_update_time = new Date(Math.max(lastest_update_time ? lastest_update_time : 0, finish_time))
}


function mappingUser(uid) {
    // console.log(mapping[uid] ? mapping[uid] : uid)
    return mapping[uid] ? mapping[uid] : uid
}

/**
 * 
 * @param {*} userObj 
 * @param {*} rank enum{'1位','2位','3位','4位','击飞'}
 */
function userAccrue(userObj, rank, pt) {

    userObj[rank] = add(userObj[rank], 1)
    if (rank == '击飞') {
        userObj['4位'] = add(userObj['4位'], 1)
    }
    userObj['场数'] = add(userObj['场数'], 1)
    userObj['1位率'] = divPercent(userObj['1位'], userObj['场数'])
    userObj['2位率'] = divPercent(userObj['2位'], userObj['场数'])
    userObj['3位率'] = divPercent(userObj['3位'], userObj['场数'])
    userObj['4位率'] = divPercent(userObj['4位'], userObj['场数'])
    userObj['击飞率'] = divPercent(userObj['击飞'], userObj['场数'])
    userObj['平顺'] = ((userObj['1位'] + userObj['2位'] * 2 + userObj['3位'] * 3 + userObj['4位'] * 4) / userObj['场数']).toFixed(4)
    userObj['累计pt'] = add(userObj['累计pt'], pt)
    if(userObj['累计pt'] ){
        userObj['累计pt']  = userObj['累计pt'].toFixed(2)
    }
    userObj['场均收支pt'] = (userObj['累计pt'] / userObj['场数']).toFixed(2)
    console.log(userObj)
}

function dictGet(dict, uid) {
    let userObj = dict[uid]
    if (!userObj) {
        dict[uid] = buildUser(uid)
    }
    return dict[uid]
}

function buildUser(uid) {
    return {
        "昵称": uid,
        "1位": 0,
        "2位": 0,
        "3位": 0,
        "4位": 0,
        "击飞": 0,
        "1位率": undefined,
        "2位率": undefined,
        "3位率": undefined,
        "4位率": undefined,
        "击飞率": undefined,
        "累计pt": 0,
        "场均收支pt": 0,
        "平顺": undefined,
        "场数": 0,
    }
}

function add(num1 = 0, num2 = 0) {
    return Number(num1) + Number(num2)
}

function divPercent(num1 = 0, num2 = 0) {
    return (num1 * 100 / num2).toFixed(2) + "%"
}

function dict2List(dict) {
    let list = []
    for (uid in dict) {
        list.push(dict[uid])
    }
    return list
}

function dictToSummary(dict) {
    //print header
    let first_uid = Object.keys(dict)[0]
    let headers = Object.keys(dict[first_uid])
    let ret = ''
    let header = ''
    for (key of headers) {
        header = header + key + ","
    }
    ret += header + '\n'
    //print raws
    for (uid in dict) {
        let raw = ''
        for (key of headers) {
            raw = raw + dict[uid][key] + ","
        }
        ret += raw + '\n'
    }
    // if (lastest_update_time) {
    //     ret += '最后更新时间:,' + lastest_update_time.toLocaleString()
    // }
    console.log(ret)
    return ret
}


function exportToCsv(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += data
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "猪咪赛顺位统计");
    document.body.appendChild(link);
    link.click();
}
