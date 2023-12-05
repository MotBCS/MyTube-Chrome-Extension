chrome.storage.sync.get(['block_comments', 'left-side-bar', 'recommendations', 'home_feed', 'shorts'], function(obj) {
    document.getElementById('comments-opt').checked = obj.block_comments == undefined ? true : obj.block_comments;


});

document.addEventListener('DOMContentLoaded', function(){
    
});