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

  duplicateTab = {
    disable: function() {
      if (updateStorageTimer) {
        clearInterval(updateStorageTimer)
        updateStorageTimer = null
      }
    },
    enable: function(interval) {
      if (interval !== updateStorageTimerInterval) {
        updateStorageTimerInterval = interval
      }
      this.disable()
      updateStorage()
      updateStorageTimer = setInterval(updateStorage, updateStorageTimerInterval)
    },
    changeInterval: function(interval) {
      this.enable(interval)
    },
    exists: function() {
      return announceTabCleanedTimer != null
    }
  }

  if (typeof require === 'function') {
    module.exports = duplicateTab
  } else {
    window.duplicateTab = duplicateTab
  }

  duplicateTab.enable()

  window.addEventListener('storage', function(storageEvent) {
    var newValue;

    if (storageEvent.key !== storageKey || storageEvent.storageArea !== storage) { return }

    // for ie: http://stackoverflow.com/a/18265557/1226532
    try { newValue = JSON.parse(event.newValue) } catch (err) { return }
    if (!newValue || eventIds.indexOf(newValue.id) > -1) { return }

    if (!announceTabCleanedTimer) {
      window.dispatchEvent(new CustomEvent('duplicate-tab'))
    }
    clearTimeout(announceTabCleanedTimer)
    announceTabCleanedTimer = setTimeout(announceDuplicatedTabCleaned, announceTabCleanedTimerDalay())
  })

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
