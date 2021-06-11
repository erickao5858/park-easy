
let settingItems
$(document).ready(() => {
    $('.brand-logo').text('Settings')
    $.get(url + 'settingItem', (data) => {
        if (!data.success) {
            // Cannot retrieve setting items
            M.toast({ html: 'Cannot retrieve new setting items!' })
            return
        }
        settingItems = data.settingItems

        updateUserSettings()
        showSettings()
    })

    $('.btn-sync').click((obj) => {
        const type = $(obj.target).text()
        syncSettings(type)
    })
})

const syncSettings = (method) => {
    if (!currentUser) {
        M.toast({ html: 'Action requires login!' })
        return
    }
    if (method == 'Save') {
        $.post(url + 'userSetting', { token: currentUser.token, userSettings: JSON.stringify(userSettings) }, (data) => {
            if (!data.success) {
                // Cannot retrieve setting items
                M.toast({ html: data.err.message })
                return
            }
            M.toast({ html: 'Settings saved!' })
        })
    }
    else {
        $.get(url + 'userSetting?token=' + currentUser.token, (data) => {
            if (!data.success) {
                // Cannot retrieve setting items
                M.toast({ html: data.err.message })
                return
            }
            userSettings = JSON.parse(data.userSettings.settings)
            Utility.setItemToLocalStorage('settingValues', userSettings)
            showSettings()
            M.toast({ html: 'Settings loaded!' })
        })
    }
}
const updateUserSettings = () => {
    if (!userSettings) userSettings = {}
    settingItems.forEach(item => {
        if (!userSettings.hasOwnProperty(item.name)) userSettings[item.name] = item.default
    })
    Utility.setItemToLocalStorage('settingValues', userSettings)
}

const showSettings = () => {
    $('.collection').empty()
    settingItems.forEach(item => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('.setting-name').text(item.name)

        if (item.type == "boolean") {
            let control = element.find('input')
            control.bind('click', { settingName: item.name }, updateSetting)
            control.prop('checked', userSettings[item.name])
        }
    })
}

const updateSetting = (event) => {
    const settingName = event.data.settingName
    const settingValue = getSettingValueBySettingName(settingName)

    userSettings[settingName] = settingValue
    try {
        Utility.setItemToLocalStorage('settingValues', userSettings)
        M.toast({ html: 'Settings updated!' })
    } catch (e) {
        M.toast({ html: 'Error: ' + e.message })
    }
}

const getSettingValueBySettingName = (settingName) => {
    return $('.setting-name:contains("' + settingName + '")').next().find('input').prop('checked')
}