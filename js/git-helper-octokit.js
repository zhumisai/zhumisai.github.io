
async function upload(authToken, fileString) {
    let octokit = new Octokit({ auth: authToken });
    let response = await octokit.request('GET /repos/zhumisai/zhumisai-web/contents/asset/data.csv', {
        // owner: 'zhumisai',
        // repo: 'zhumisai-web',
        // path: 'data.csv',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    checkOctokitResponse(response)
    console.log(response)
    let promise = octokit.request('PUT /repos/zhumisai/zhumisai-web/contents/asset/data.csv', {
        // owner: 'zhumisai',
        // repo: 'zhumisai-web',
        // path: 'data.csv',
        message: 'commit data.csv',
        committer: {
            name: 'from_browser',
            email: 'guest_abc@github.com'
        },
        sha: response.data.sha,
        content: Base64.encode(fileString),
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).catch(alert)
    let resposne2 = await promise
    checkOctokitResponse(resposne2)
    // fetch('https://api.github.com/repos/zhumisai/zhumisai-web/contents/asset/data.csv', {
    //     method: 'put',
    //     body: JSON.stringify({
    //         "message": "commit data.csv",
    //         "committer": {
    //             "name": "from_browser",
    //             "email": "guest_abc@github.com"
    //         },
    //         "content": "aGVsbG8sd29ybGQsaGVsbG8sa2l0dHk=",
    //         "sha": response.sha
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer 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',
    //         'X-Github-Api-Version': '2022-11-28',
    //         'Accept':'application/vnd.github.v3+json'
    //     }
    // })
    //     .then(function (data) {
    //         return data.text();
    //     }).then(function (data) {
    //         console.log(data)
    //     });
}

function checkOctokitResponse(response){
    if(!response){
        alert("错误")
    } else if(response.status != 200){
        alert("错误码("+response.status+"), 联系网站管理员")
    }
}