/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {
  BannerIntent,
  CardContainerBuilder,
  connectExtensionHost,
  ConnectedExtension,
  ExtensionSDK,
  UiBuilderFactory,
  BannerBuilder,
  SidebarBuilder,
  UiBuilder,
} from '@looker/extension-sdk'

(function () {
  let _factory: UiBuilderFactory
  let _extensionSdk: ExtensionSDK
  let _sidebar: SidebarBuilder
  let _cardContainer: CardContainerBuilder

  connectExtensionHost().then((connectedExtension: ConnectedExtension) => {
    const { initialRoute, extensionSdk, uiBuilderFactory } = connectedExtension
    if (!uiBuilderFactory) {
      const message =
        'UI builder factory not initialized. Check the application definition in the manifest to ensure use_extension_ui is set to yes.'
      console.error(message)
      throw new Error(message)
    }
    _extensionSdk = extensionSdk
    _factory = uiBuilderFactory as UiBuilderFactory
    app(initialRoute ? initialRoute.substring(1) : '')
  })

  const app = (initialItem: string) => {
    _factory.createHeading('UI Components Demo')
    _factory.createContainer('row')
    _sidebar = _factory.createSidebar()
    _sidebar.props = { minWidth: '225px' }
    _sidebar.onSelect(onSidebarItemSelect)
    _cardContainer = _factory.createCardContainer()
    const componentStateDemoCtr = componentStateDemo(_cardContainer)
    const bannerDemoCtr = bannerDemo(_cardContainer)
    _sidebar.items = [
      {
        icon: 'Flag',
        label: 'Component state demo',
        id: componentStateDemoCtr.id,
      },
      { icon: 'Flag', label: 'Banner demo', id: bannerDemoCtr.id },
    ]
    const validItems = [componentStateDemoCtr.id, bannerDemoCtr.id]
    const selectItem =
      validItems.find((item) => item === initialItem) || validItems[0]
    _sidebar.select(selectItem)
    _factory.render()
  }

  const componentHeading = (label: string, as: string = 'h3') => {
    const heading = _factory.createHeading(label)
    heading.as = as
    heading.props = { my: 'small' }
  }

  const componentStateDemo = (cardContainer: CardContainerBuilder) => {
    const demoCtr = cardContainer.createColumnContainer()
    demoCtr.id = 'comp_state_demo'
    componentHeading('Component state demo')
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide', 'right')
    const readonlyCheckbox = _factory.createFieldCheckbox('Readonly', 'right')
    const requiredCheckbox = _factory.createFieldCheckbox('Required ', 'right')
    _factory.popContainer()
    const fieldText = _factory.createFieldText('Field text', 'left')
    fieldText.width = '400px'
    const fieldTextValue = _factory.createFieldText('Field text value', 'left')
    fieldTextValue.bind(fieldText)
    fieldTextValue.width = '400px'
    fieldTextValue.readonly = true
    hideCheckbox.onChange((value: boolean) => {
      fieldText.hidden = value
    })
    readonlyCheckbox.onChange((value: boolean) => {
      fieldText.readonly = value
    })
    requiredCheckbox.onChange((value: boolean) => {
      fieldText.required = value
    })
    return demoCtr
  }

  const bannerDemo = (cardContainer: CardContainerBuilder) => {
    const demoCtr = cardContainer.createContainer('column')
    demoCtr.id = 'banner_demo'
    componentHeading('Banner demo')
    componentHeading('Static banners', 'h4')
    const intents: BannerIntent[] = ['error', 'warning', 'info', 'confirmation']
    intents.forEach(
      (intent: BannerIntent) => {
        const banner = _factory.createBanner()
        banner.text = `Static ${intent}`
        banner.intent = intent
      }
    )
    componentHeading('Dynamic banner', 'h4')
    _factory.createRowContainer()
    const updateDynamicBanner = (radioId: string, builder: UiBuilder) => {
      if (radioId === builder.id) {
        const banner = _factory.findBuilderForId('dynamicBanner') as BannerBuilder
        if (banner) {
          if (radioId === 'none') {
            banner.clearMessage()
          } else  {
            banner[radioId] = `Display an ${radioId} message`
          }
        }
      }
    }
    _factory.createFieldRadio('bannerType', 'None')
      .onChange(updateDynamicBanner)
      .id = 'none'
    intents.forEach(
      (intent: BannerIntent) => {
        _factory.createFieldRadio('bannerType', intent.charAt(0).toUpperCase() + intent.substring(1))
          .onChange(updateDynamicBanner)
          .id = intent
      }
    )
    _factory.popContainer()
    _factory.createBanner().id = 'dynamicBanner'
    return demoCtr
  }

  const onSidebarItemSelect = (itemId: string) => {
    _cardContainer.active = itemId
    _extensionSdk.clientRouteChanged('/' + itemId)
  }

})()
