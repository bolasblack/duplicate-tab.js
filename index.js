;(function() {

  var storage = window.localStorage,
      storageKey = 'duplicate-tab:checker',
      // Some browser will make setInterval slower when tab in background,
      // so the number should be large time
      announceDalay = 2 * 1000,
      announceTimer,
      duplicateTab

  window.addEventListener('storage', function(storageEvent) {
    if (storageEvent.key !== storageKey || storageEvent.storageArea !== storage) { return }
    if (!announceTimer) {
      window.dispatchEvent(new CustomEvent('duplicate-tab'))
    }
    clearTimeout(announceTimer)
    announceTimer = setTimeout(announceDuplicatedTabCleaned, announceDalay)
  })

  setInterval(function() {
    storage.setItem(storageKey, Date.now() + Math.random())
  }, 500)

  function announceDuplicatedTabCleaned() {
    announceTimer = null
    window.dispatchEvent(new CustomEvent('duplicate-tab:cleaned'))
  }

  duplicateTab = {
    exists: function() { return announceTimer != null }
  }

  if (typeof require === 'function') {
    module.exports = duplicateTab
  } else {
    window.duplicateTab = duplicateTab
  }

})();
