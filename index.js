;(function() {

  var
      updateStorageTimerInterval = 500,
      updateStorageTimer,

      // Some browser will make setInterval slower when tab in background,
      // so the interval should be larger
      announceDalayOffset = 1000 * 2,
      announceTabCleanedTimerDalay = function() { return updateStorageTimerInterval + announceDalayOffset },
      announceTabCleanedTimer,

      storage = window.localStorage,
      storageKey = 'duplicate-tab:checker',
      eventIds = [],
      duplicateTab

  window.addEventListener('storage', function(storageEvent) {
    var newValue;

    if (storageEvent.key !== storageKey || storageEvent.storageArea !== storage) { return }

    // for ie: http://stackoverflow.com/a/18265557/1226532
    try { newValue = JSON.parse(event.newValue) } catch (err) { return }
    if (eventIds.indexOf(newValue.id) > -1) { return }

    if (!announceTabCleanedTimer) {
      window.dispatchEvent(new CustomEvent('duplicate-tab'))
    }
    clearTimeout(announceTabCleanedTimer)
    announceTabCleanedTimer = setTimeout(announceDuplicatedTabCleaned, announceTabCleanedTimerDalay())
  })

  updateStorage()
  updateStorageTimer = setInterval(updateStorage, updateStorageTimerInterval)

  duplicateTab = {
    exists: function() { return announceTabCleanedTimer != null },
    changeInterval: function(interval) {
      updateStorageTimerInterval = interval
      clearInterval(updateStorageTimer)
      updateStorageTimer = setInterval(updateStorage, interval)
    }
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
    announceTabCleanedTimer = null
    window.dispatchEvent(new CustomEvent('duplicate-tab:cleaned'))
  }

  function updateStorage() {
    var id = generateGUID()
    eventIds.push(id)
    storage.setItem(storageKey, JSON.stringify({id: id}))
  }

})();
