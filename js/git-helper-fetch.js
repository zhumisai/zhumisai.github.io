async function upload(authToken, fileName, fileString) {
    // 
    let response = await fetch('https://api.github.com/repos/zhumisai/zhumisai-web/contents/assets/'+fileName, {
        method: 'get',
        headers: {
            'Authorization': 'Bearer '+ authToken,
            'X-Github-Api-Version': '2022-11-28',
            'Accept':'application/vnd.github.v3+json'
        }
    })
    let success = checkOctokitResponse(response)
    if(!success){
        return
    }
    let jspnResp = JSON.parse(await response.text())
    let response2 = await fetch('https://api.github.com/repos/zhumisai/zhumisai-web/contents/assets/'+fileName, {
        method: 'put',
        body: JSON.stringify({
            "message": "commit data.csv",
            "committer": {
                "name": "from_browser",
                "email": "guest_abc@github.com"
            },
            "content": Base64.encode(fileString),
            "sha": jspnResp.sha
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ authToken,
            'X-Github-Api-Version': '2022-11-28',
            'Accept':'application/vnd.github.v3+json'
        }
    })
    checkOctokitResponse(response2)
    let success2 = checkOctokitResponse(response)
    if(!success2){
        return
    }
}

 function checkOctokitResponse(response) {
    if(!response){
        alert("错误")
        return false
    } else if(response.status != 200){
        alert("错误码("+response.status+"), 联系网站管理员")
        return false
    } else{
        return true
    }
}