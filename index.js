;(function() {

  var storage = window.localStorage,
      storageKey = 'duplicate-tab:checker',
      // Some browser will make setInterval slower when tab in background,
      // so the number should be large time
      announceDalay = 2 * 1000,
      announceTimer,
      eventIds = [],
      duplicateTab

  window.addEventListener('storage', function(storageEvent) {
    var newValue;

    if (storageEvent.key !== storageKey || storageEvent.storageArea !== storage) { return }

    // for ie
    // http://stackoverflow.com/a/18265557/1226532
    try { newValue = JSON.parse(event.newValue) } catch (err) { return }
    if (eventIds.indexOf(newValue.id) > -1) { return }

    if (!announceTimer) {
      window.dispatchEvent(new CustomEvent('duplicate-tab'))
    }
    clearTimeout(announceTimer)
    announceTimer = setTimeout(announceDuplicatedTabCleaned, announceDalay)
  })

  setInterval(function() {
    var id = generateGUID()
    eventIds.push(id)
    storage.setItem(storageKey, JSON.stringify({id: id}))
  }, 500)

  duplicateTab = {
    exists: function() { return announceTimer != null }
  }

  if (typeof require === 'function') {
    module.exports = duplicateTab
  } else {
    window.duplicateTab = duplicateTab
  }

  function generateGUID() {
    return '' + Date.now() + Math.random()
  }

  function announceDuplicatedTabCleaned() {
    announceTimer = null
    window.dispatchEvent(new CustomEvent('duplicate-tab:cleaned'))
  }

})();
