const settingItems = [
    {
        "name": "Hide unavailable locations",
        "type": "checkbox",
        "default": false
    },
    {
        "name": "Refresh locations every minute",
        "type": "checkbox",
        "default": false
    }
]
let userSettings
$(document).ready(() => {
    if (!currentUser) $(location).attr('href', '/login')
    userSettings = Utility.getItemFromLocalStorage('settingValues')
    if (!userSettings) {
        initUserSettings(settingItems)
        showSettings(settingItems)
    }
    else {
        showSettings(settingItems, userSettings)
    }
})

const initUserSettings = (settingItems) => {
    userSettings = {}
    settingItems.forEach(item => {
        userSettings[item.name] = item.default
    })
    Utility.setItemToLocalStorage('settingValues', userSettings)
}

const showSettings = (settingItems, userSettings) => {
    settingItems.forEach(item => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('.setting-name').text(item.name)

        // TODO: NOT IN MVP
        // Determine type of setting item and create corresponding component
        let control = element.find('input')
        control.bind('click', { settingName: item.name }, updateSetting)
        if (!userSettings) control.prop('checked', item.value)
        else control.prop('checked', userSettings[item.name])
    })
}

const updateSetting = (event) => {
    // TODO: NOT IN MVP
    // Acquire data in different form e.g, numeric data
    const settingName = event.data.settingName
    const settingValue = getSettingValueBySettingName(settingName)

    // TODO: NOT IN MVP
    // Implement a function to solve toast spamming
    // allow 3 toasts at the same time

    userSettings[settingName] = settingValue
    try {
        Utility.setItemToLocalStorage('settingValues', userSettings)
        M.toast({ html: 'Settings updated' })
    } catch (e) {
        M.toast({ html: 'Error: ' + e.message })
    }
}

const getSettingValueBySettingName = (settingName) => {
    // TODO: NOT IN MVP
    // add a parameter for determine control type and return correct form of setting value
    return $('.setting-name:contains("' + settingName + '")').next().find('input').prop('checked')
}