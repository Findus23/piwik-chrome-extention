// Saves options to chrome.storage
function save_options(evt) {
    evt.preventDefault();
    var status = document.getElementById('status');
    status.textContent = '';

    chrome.storage.local.set({
        url: document.getElementById('url').value,
        siteId: document.getElementById('siteId').value,
        accessToken: document.getElementById('accessToken').value,
        badgelastHours: document.getElementById('badgelastHours').value,
        badgeRefresh: document.getElementById('badgeRefresh').value,
        listMax: document.getElementById('listMax').value,
        listLastDays: document.getElementById('listLastDays').value
    }, function () {
        // Update status to let user know options were saved.
        console.log("saved");
        status.textContent = 'Options saved.';
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        url: "",
        siteId: 1,
        accessToken: "",
        badgelastHours: 24,
        badgeRefresh: 1,
        listMax: 10,
        listLastDays: 2
    }, function (settings) {
        console.info(settings);
        document.getElementById('url').value = settings.url;
        document.getElementById('siteId').value = settings.siteId;
        document.getElementById('accessToken').value = settings.accessToken;
        document.getElementById('badgelastHours').value = settings.badgelastHours;
        document.getElementById('badgeRefresh').value = settings.badgeRefresh;
        document.getElementById('listMax').value = settings.listMax;
        document.getElementById('listLastDays').value = settings.listLastDays;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('form').addEventListener('submit', save_options);
