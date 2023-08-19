const https = require('https');
const fs = require('fs');
const JSONbig = require('json-bigint');

const UploadToDropBox = async(token, filename) => {
    const req = https.request(`https://content.dropboxapi.com/2/files/upload_session/start`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Dropbox-API-Arg': JSON.stringify({
                'close': false
            }),
            'Content-Type': 'application/octet-stream',
        }
    }, (res) => {
        res.on('data', (d) => {
            const json = JSON.parse(d.toString('utf-8'));
            // console.log('err1',json, json.session_id)
            const session_id = json.session_id
            let offset = 0;

            const stream = fs.createReadStream(`./public/${filename}`);
            stream.on('data', (chunk) => {
                console.log(offset);
                stream.pause();
                const reqAppend = https.request(`https://content.dropboxapi.com/2/files/upload_session/append_v2`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Dropbox-API-Arg': JSONbig.stringify({
                            'cursor': {
                                'session_id': session_id,
                                'offset': offset
                            },
                            'close': false
                        }),
                        'Content-Type': 'application/octet-stream',
                    }
                }, (res) => {
                    stream.resume();
                });

                reqAppend.write(chunk);
                reqAppend.end();

                offset += chunk.length;
            });

            stream.on('end', () => {
                const reqFinish = https.request(`https://content.dropboxapi.com/2/files/upload_session/finish`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Dropbox-API-Arg': JSON.stringify({
                            'cursor': {
                                'session_id': session_id,
                                'offset': offset
                            },
                            "commit": {
                                "path": `/Upload/${filename}`,
                                "mode": "add",
                                "autorename": true,
                                "mute": false,
                                "strict_conflict": false
                            }
                        }),
                        'Content-Type': 'application/octet-stream',
                    }
                }, (res) => {
                    console.log('upload session finish')
                    console.log("statusCode: ", res.statusCode);
                });

                reqFinish.end();
            });
        });
    });


    req.end();
}

module.exports = {
    UploadToDropBox
}