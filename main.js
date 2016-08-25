function getCounter() {
    var x = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("module", "API");
    formData.append("method", "Live.getCounters");
    formData.append("idSite", s.siteId);
    formData.append("lastMinutes", s.badgelastHours * 60);
    formData.append("format", "JSON");
    formData.append("token_auth", s.accessToken);

    x.open("POST", s.url + "index.php", true);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            if (x.status == 200) {
                var response = JSON.parse(x.responseText)[0];
                chrome.browserAction.setBadgeText({text: response["visits"]});
            } else {
                console.error("FEHLER:" + x.status + x.response)
            }
        }
    };
    x.send(formData);
}
function getVisitorLog(success) {
    var x = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("module", "API");
    formData.append("method", "Live.getLastVisitsDetails");
    formData.append("period", "range");
    formData.append("date", "last" + s.listLastDays);
    formData.append("filter_limit", s.listMax);
    formData.append("idSite", s.siteId);
    formData.append("format", "JSON");
    formData.append("token_auth", s.accessToken);

    x.open("POST", s.url + "index.php", true);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            if (x.status == 200) {

                var response = JSON.parse(x.responseText);
                console.log(response);
                success(response);
            } else {
                console.error("FEHLER:" + x.status + x.response)
            }

        }
    };
    x.send(formData);
}
function updateVisitorLog() {
    document.getElementById('visitors').innerHTML = localStorage["htmlCache"];

    getVisitorLog(function (response) {
        var list = [
            "serverDatePretty",
            "serverTimePretty",
            "visitDurationPretty",
            "browserIcon",
            "deviceTypeIcon",
            "operatingSystemIcon",
            "visitorTypeIcon",
            "countryFlag",
            "actions",
            "visitIp",
            "referrerUrl"
        ];
        document.getElementById('visitors').innerHTML = "";
        var i, visitor;
        for (i = 0; i < response.length; ++i) {
            visitor = response[i];
            var tr = document.createElement('tr');
            for (var j = 0; j < list.length; j++) {
                var key = list[j];
                var td = tr.appendChild(document.createElement('td'));
                if (key.indexOf("Icon") !== -1 || key.indexOf("Flag") !== -1) {
                    if (visitor[key]) {
                        td.innerHTML = "<img src='" + s.url + visitor[key] + "'>";
                    }
                } else if (key == "referrerUrl" && visitor[key]) {
                    var link = document.createElement('a');
                    link.href = visitor[key];
                    link.target = "_blank";
                    link.textContent = link.hostname;
                    td.appendChild(link);
                }
                else {
                    td.textContent = visitor[key];
                }
                tr.appendChild(td);
            }
            document.getElementById('visitors').appendChild(tr);
        }
        localStorage["htmlCache"] = document.getElementById('visitors').innerHTML;
        return true;
    })
}
var s;
chrome.storage.local.get({
        url: "https://demo.piwik.org/",
        siteId: 7,
        accessToken: "",
        badgelastHours: 1,
        badgeRefresh: 1,
        listMax: 10,
        listLastDays: 2
    }, function (settings) {
        s = settings;
        if (chrome.extension.getBackgroundPage() === window) {
            /*
             chrome.runtime.onInstalled.addListener(function () {
             chrome.tabs.create({
             url: chrome.extension.getURL("settings.html")
             });
             });
             */

            chrome.browserAction.setBadgeBackgroundColor({color: "#2c58a2"});
            getCounter(settings);
            setInterval(getCounter, 60 * 1000);


        } else {
            updateVisitorLog(settings);
        }
    }
);
