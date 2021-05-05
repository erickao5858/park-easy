let userSettings
$(document).ready(() => {
    if (!currentUser) $(location).attr('href', '/login')

    const url = DEV_MODE ? API_URL['DEV'] : API_URL['PRO']
    $.get(url + 'settingItem', (data) => {
        if (!data.success) {
            // Cannot retrieve setting items
            M.toast({ html: 'Server under maintenance, please come back later!' })
            return
        }
        const settingItems = data.settingItems

        userSettings = Utility.getItemFromLocalStorage('settingValues')
        updateUserSettings(settingItems)
        showSettings(settingItems, userSettings)
    })
})

const updateUserSettings = (settingItems) => {
    if (!userSettings) userSettings = {}
    settingItems.forEach(item => {
        if (!userSettings.hasOwnProperty(item.name)) userSettings[item.name] = item.default
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
        if (settingItems.type == "boolean") {
            let control = element.find('input')
            control.bind('click', { settingName: item.name }, updateSetting)
            control.prop('checked', userSettings[item.name])
        }
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