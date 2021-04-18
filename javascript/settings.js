let userSettings = []
$(document).ready(() => {
    const hasUserSettings = retrieveUserSettingsFromLocalStorage()
    if (!hasUserSettings) initUserSettings(settingItems)
    showSettings(userSettings)
})

const initUserSettings = (settingItems) => {
    settingItems.forEach(item => {
        userSettings.push({
            'name': item.name,
            'type': item.type,
            'value': item.default
        })
    })
}

const retrieveUserSettingsFromLocalStorage = () => {
    if (!localStorage.getItem('settingValues')) return false
    userSettings = JSON.parse(localStorage.getItem('settingValues'))
    console.log(userSettings)
    return true
}

const showSettings = (settingItems) => {
    settingItems.forEach(item => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('.setting-name').text(item.name)

        // TODO: NOT IN MVP
        // Determine type of setting item and create corresponding component
        let control = element.find('input')
        control.bind('click', { settingName: item.name }, updateSetting)
        control.prop('checked', item.value)
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


    // TODO: Update localStorage
    userSettings.forEach(setting => {
        if (setting.name == settingName) setting.value = settingValue
    })
    try {
        localStorage.setItem('settingValues', JSON.stringify(userSettings))
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