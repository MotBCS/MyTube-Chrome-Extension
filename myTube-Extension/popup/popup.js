chrome.storage.sync.get(['block_comments', 'left_side_bar', 'recommendations', 'home_feed', 'shorts'], function (obj) {
    document.getElementById('comments-opt').checked = obj.block_comments == undefined ? true : obj.block_comments;
    document.getElementById('left-side-bar-opt').checked = obj.left_side_bar == undefined ? true : obj.left_side_bar;
    document.getElementById('recommendation-opt').checked = obj.recommendations == undefined ? true : obj.recommendations;
    document.getElementById('home-feed-opt').checked = obj.home_feed == undefined ? true : obj.home_feed;
    document.getElementById('shorts-opt').checked = obj.shorts == undefined ? true : obj.shorts;
});

document.addEventListener('DOMContentLoaded', function () {
    var blockCommentsCheckBox = document.getElementById('comments-opt');
    blockCommentsCheckBox.addEventListener('change', function () {
        chrome.storage.sync.set({
            block_comments: basedOnChecked(blockCommentsCheckBox.checked)
        });
    }, false);

    var leftSideBarCheckBox = document.getElementById('left-side-bar-opt');
    leftSideBarCheckBox.addEventListener('change', function () {
        chrome.storage.sync.set({
            left_side_bar: basedOnChecked(leftSideBarCheckBox.checked)
        });
    }, false);

    var recommendationsCheckBox = document.getElementById('recommendation-opt');
    recommendationsCheckBox.addEventListener('change', function () {
        chrome.storage.sync.set({
            recommendations: basedOnChecked(recommendationsCheckBox.checked)
        });
    }, false);

    var homeFeedCheckBox = document.getElementById('home-feed-opt');
    homeFeedCheckBox.addEventListener('change', function () {
        chrome.storage.sync.set({
            home_feed: basedOnChecked(homeFeedCheckBox.checked)
        });
    }, false);

    var shortsCheckBox = document.getElementById('shorts-opt');
    shortsCheckBox.addEventListener('change', function () {
        chrome.storage.sync.set({
            shorts: basedOnChecked(shortsCheckBox.checked)
        });
    }, false);
}, false);

function basedOnChecked(checked) {
    if (checked) {
        return 'none'
    }
    return '';
}

document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const channelsList = document.getElementById('channelsList');

    saveButton.addEventListener('click', saveChannel);

    function saveChannel() {
        const channelNameInput = document.getElementById("channelNameInput");
        const channelUrlInput = document.getElementById("channelUrlInput");

        const channelName = channelNameInput.value.trim();
        const channelUrl = channelUrlInput.value.trim();

        if (channelName !== "" && channelUrl !== "") {
            chrome.storage.sync.get({ channels: [] }, function (result) {
                const channels = result.channels;
                channels.push({ name: channelName, url: channelUrl });

                chrome.storage.sync.set({ channels: channels }, function () {
                    updateSavedChannels(channels);
                });
            });

            channelNameInput.value = "";
            channelUrlInput.value = "";
        }
    }

    function updateSavedChannels(channels) {
        channelsList.innerHTML = ""; //Clear the list before updating
        channels.forEach(function (channel, index) {
            const listItem = document.createElement("li");

            const channelLink = document.createElement("a");
            channelLink.href = channel.url;
            channelLink.target = "_blank";
            channelLink.innerText = channel.name;

            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.addEventListener('click', function () {
                editChannel(index, channel);
            });

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener('click', function () {
            });

            listItem.appendChild(channelLink);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            channelsList.appendChild(listItem);
        });

        const savedChannelsDiv = document.getElementById("savedChannels");
        savedChannelsDiv.innerHTML = "<p>Saved Channels:</p>";

        channels.forEach(function (channel) {
            const channelLink = document.createElement("a");
            channelLink.href = channel.url;
            channelLink.target = "_blank";
            channelLink.innerText = channel.name;

            savedChannelsDiv.appendChild(channelLink);
            savedChannelsDiv.appendChild(document.createElement("br"))
        });
    }

    function editChannel(index, channel) {
        const newName = prompt("Enter a new name:", channel.name);
        const newUrl = prompt("Enter a new URL:", channel.url);

        if (newName !== null && newUrl !== null) {
            chrome.storage.sync.get({ channels: [] }, function (result) {
                const channels = result.channels;
                channels[index] = { name: newName, url: newUrl };

                chrome.storage.sync.set({ channels: channels }, function () {
                    updateSavedChannels(channels);
                });
            });
        }
    }

    function deleteChannel(index) {
        const confirmDelete = confirm("Delete Channel?");
        if (confirmDelete) {
            chrome.storage.sync.get({ channels: [] }, function (result) {
                const channels = result.channels;
                channels.splice(index, 1);

                chrome.storage.sync.set({ channels: channels }, function () {
                    updateSavedChannels(channels);
                });
            });
        }
    }

    function updateSavedChannels(channels) {
        channelsList.innerHTML = ""; //Clear the list before updating
        channels.forEach(function (channel, index) {
            const listItem = document.createElement("li");
            listItem.style.listStyleType = "None"

            const channelLink = document.createElement("a");
            channelLink.style.textDecoration = "None";
            channelLink.href = channel.url;
            channelLink.target = "_blank";
            channelLink.innerText = channel.name;

            const editButton = document.createElement("button");
            // Styles for Edit Button
            editButton.style.backgroundColor = "#f28080";
            editButton.style.borderRadius = "5px";
            editButton.style.border = "None";
            editButton.style.color = "White"
            editButton.style.marginLeft = "6px"
            editButton.style.marginRight = "6px"
            editButton.innerText = "Edit";
            //
            editButton.addEventListener('click', function () {
                editChannel(index, channel);
            });

            const deleteButton = document.createElement("button");
            // Styles for Delete Button
            deleteButton.style.backgroundColor = "#f28080";
            deleteButton.style.borderRadius = "5px";
            deleteButton.style.border = "None";
            deleteButton.style.color = "White"
            deleteButton.innerText = "Delete";
            //
            deleteButton.addEventListener('click', function () {
                deleteChannel(index);
            });

            listItem.appendChild(channelLink);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            channelsList.appendChild(listItem);
        });
    }
    chrome.storage.sync.get({ channels: [] }, function (result) {
        const channels = result.channels;
        updateSavedChannels(channels);
    });
});
