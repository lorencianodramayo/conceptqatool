const express = require("express");
const fetch = require("cross-fetch");
const axios = require('axios');
const AdmZip = require('adm-zip')
const { Storage } = require('@google-cloud/storage');
const uuid = require("uuid");

const router = express.Router();
const uuidv1 = uuid.v1;

//models
const TemplateModel = require("../models/TemplateModel");

require("dotenv").config();
//bucket settings
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY,
    },
});
//get bucket config
const bucket = storage.bucket(process.env.GCS_BUCKET);

router.get("/getPartners", (req, res, next) => {
    return getAdlibToken().then((result) => {
        if (result.status === "ok") {
            fetch("https://api-app.ad-lib.io/api/v2/partners", {
                headers: {
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    pragma: "no-cache",
                    "sec-ch-ua":
                        '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    cookie: `connect.sid=${result.data};`,
                },
                referrer: "https://app.ad-lib.io/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: null,
                method: "GET",
                mode: "cors",
            })
                .then((response) =>
                    response
                        .json()
                        .then((data) => ({ status: response.status, body: data }))
                )
                .then((obj) => res.status(200).json(obj));
        }
    });
});

router.get("/getConcepts", (req, res, next) => {
    return getAdlibToken().then((result) => {
        if (result.status === "ok") {
            fetch(
                "https://api-app.ad-lib.io/api/v2/assets/concepts?partnerId=" +
                req.query.pId,
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        pragma: "no-cache",
                        "sec-ch-ua":
                            '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        cookie: `connect.sid=${result.data};`,
                    },
                    referrer: "https://app.ad-lib.io/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: null,
                    method: "GET",
                    mode: "cors",
                }
            )
                .then((response) =>
                    response
                        .json()
                        .then((data) => ({ status: response.status, body: data }))
                )
                .then((obj) => res.status(200).json(obj));
        }
    });
});

router.get("/getCreatives", (req, res, next) => {
    return getAdlibToken().then((result) => {
        if (result.status === "ok") {
            let allData = [];
            fetch(
                `https://api-app.ad-lib.io/api/v2/assets/concepts/${req.query.cId}?partnerId=${req.query.pId}`,
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        pragma: "no-cache",
                        "sec-ch-ua":
                            '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        cookie: `connect.sid=${result.data};`,
                    },
                    referrer: "https://app.ad-lib.io/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: null,
                    method: "GET",
                    mode: "cors",
                }
            )
                .then((response) =>
                    response
                        .json()
                        .then((data) => ({ status: response.status, body: data }))
                )
                .then((obj) => {
                    //alterCreative(obj, req, result).then((a) => console.log(a));
                    //res.status(200).json(obj);
                    getVersions(obj.body, res, result);
                });
        }
    });
});

router.get("/getTemplate", (req, res, next) => {
    return getAdlibToken().then((result) => {
        if (result.status === "ok") {
            fetch(
                "https://api-app.ad-lib.io/api/v2/assets/templates/" + req.query.tId + "?partnerId=" +
                req.query.pId,
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        pragma: "no-cache",
                        "sec-ch-ua":
                            '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        cookie: `connect.sid=${result.data};`,
                    },
                    referrer: "https://app.ad-lib.io/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: null,
                    method: "GET",
                    mode: "cors",
                }
            )
                .then((response) =>
                    response
                        .json()
                        .then((data) => ({ status: response.status, body: data })))
                .then((obj) => {
                    if (req.query.type === "normal") {
                        res.json(obj)
                    } else {
                        let newObj = {
                            dynamicValues: obj.body.defaultDynamicFieldsValues,
                            possibleValues: obj.body.possibleValues,
                            size: obj.body.size,
                            name: obj.body.name,
                            dynamicElements: obj.body.dynamicElements,
                            fileURL: obj.body.url
                        };

                        getFiles(newObj, res);
                    }
                })
        }
    });
})

async function getFiles(obj, res) {
    let uid = uuidv1(),
        html = "",
        updatedIndex = "",
        newFile,
        count = 0,
        arrAssets = [];

    const body = await axios.get(obj.fileURL, {
        responseType: 'arraybuffer',
    });

    const zip = new AdmZip(body.data);

    zip.getEntries().forEach((entries) => {
        if (!entries.isDirectory) {
            newFile = `${uid}/${entries.entryName}`;

            if (entries.name === 'index.html') {
                html = entries.getData().toString("utf8");

                updatedIndex = html.split("</html>")[0] +
                    `<script>

                    window.addEventListener("message",
                    (event) => {
                        if(typeof event.data === "object"){
                            defaultValues= event.data;
                        }else{
                          if(event.data === "pause"){
                            gwd.auto_PauseBtnClick();
                          }else if(event.data === "play"){
                            gwd.auto_PlayBtnClick();
                          }else{
                            if(typeof Adlib!=='undefined'){
                                Adlib.localTimeline = function(status){
                                  status = status||null;
                                  switch(status){
                                      case "PLAY":
                                        if(_obj.timelineEvent == null){
                                            var t = "0.0";
                                            _obj.timelineEvent = setInterval(function(){
                                                t = (gsap.globalTimeline.time().toFixed(1)> 0.5)? gsap.globalTimeline.time().toFixed(1) : t ;
                                                parent.postMessage({
                                                  type: 'CREATIVE_TIME', t
                                                }, '*');
                                            }, 100);
                                        }
                                      break;
                                      case "PAUSE":
                                          clearInterval(_obj.timelineEvent);
                                          _obj.timelineEvent=null;
                                      break;
                                      case "END":
                                          clearInterval(_obj.timelineEvent);
                                          _obj.timelineEvent=null;
                                      break;
                                  }
                                }
                              }
                          }
                        }
                    },
                    false
                );
              </script></html>`;
                //reconvert back to utf8
                entries.setData(Buffer.from(updatedIndex, "utf8"));
            } else if ([".png", ".jpg", ".jpeg", ".gif"].some((t) =>
                entries.name.includes(t)
            )) {
                entries.name.substring(0, 2) !== "._" ?
                    arrAssets.push(entries.name) : null
            }
            //bucket functions
            let file = bucket.file(newFile);
            let fileStream = file.createWriteStream();

            fileStream.on("error", (err) => console.log(err));
            fileStream.on("finish", () => {
                if (file.name.includes("index.html")) {
                    indexList = 1;
                }
                count++;

                if (count === zip.getEntries().length - 1 && indexList !== 0) {
                    const bucketTemplate = new TemplateModel({
                        url: process.env.GCS_BUCKET,
                        uid: uid,
                        directory: entries.entryName.split("/")[0],
                        dynamicValues: obj.dynamicValues,
                        possibleValues: obj.possibleValues,
                        size: obj.size,
                        name: obj.name,
                        dynamicElements: obj.dynamicElements,
                        fileURL: obj.url,
                        assets: arrAssets
                    });

                    //saving entries
                    bucketTemplate.save((error, result) => {
                        if (error) {
                            return res
                                .status(500)
                                .json({ msg: "Sorry, internal server errors" });
                        }

                        return res.json(result);
                    });
                }
            });
            fileStream.end(entries.getData());
        }
    })
}

async function getAdlibToken() {
    var details = {
        username: "ciano@ad-lib.io",
        password: "W4d1w4dz",
    };

    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    var loginRequest = await fetch("https://api-app.ad-lib.io/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
    });

    var responseHeaders = loginRequest.headers;
    var responseCookies = responseHeaders.get("set-cookie");
    var loginCookie = responseCookies.substr(
        responseCookies.indexOf("connect.sid=") + 12,
        responseCookies.indexOf(";") -
        (responseCookies.indexOf("connect.sid=") + 12)
    );

    return { status: "ok", data: loginCookie };
}

async function getVersions(obj, res, result) {
    var count = 0;

    await obj.templates.map((data, index) => {
        if (result.status === "ok") {
            fetch(
                `https://api-app.ad-lib.io/api/v2/assets/templates/${data.generation}/versions?partnerId=${obj.partnerId}`,
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        pragma: "no-cache",
                        "sec-ch-ua":
                            '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        cookie: `connect.sid=${result.data};`,
                    },
                    referrer: "https://app.ad-lib.io/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: null,
                    method: "GET",
                    mode: "cors",
                }
            )
                .then((response) =>
                    response
                        .json()
                        .then((data) => ({ status: response.status, body: data }))
                )
                .then((template) => {
                    count++;
                    obj.templates[index].templateVersion = template.body.versions;
                    if (obj.templates.length === count) {
                        res.status(200).json({ body: obj });
                    }
                });
        }
    });
}

module.exports = router;
