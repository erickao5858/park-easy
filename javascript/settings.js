$(document).ready(() => {
    showSettings(settingItems)
})

const showSettings = (settingItems) => {
    // TODO: get user settings from cookie
    settingItems.forEach(item => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('.setting-name').text(item.name)

        // TODO: NOT IN MVP
        // Determine type of setting item and create corresponding component
        let control = element.find('input')
        control.bind('click', { settingName: item.name }, updateSetting)
        //click(updateSetting)
    })
}

const updateSetting = (event) => {
    const settingName = event.data.settingName
    const settingValue = getSettingValueBySettingName(settingName)

    // TODO: NOT IN MVP
    // Implement a function to solve toast spamming
    // allow 3 toasts at the same time

    M.toast({ html: 'Settings updated' })
    // TODO: Update cookie
}

const getSettingValueBySettingName = (settingName) => {
    // TODO: NOT IN MVP
    // add a parameter for determine control type and return correct form of setting value
    return $('.setting-name:contains("' + settingName + '")').next().find('input').prop('checked')
}