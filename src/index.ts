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
  connectExtensionHost,
  ConnectedExtension,
  ExtensionSDK,
  UiBuilderFactory,
  BannerBuilder,
  UiBuilder,
} from '@looker/extension-sdk'

(function () {
  let _factory: UiBuilderFactory
  let _extensionSdk: ExtensionSDK

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
    const demos = [
      {
        icon: 'Flag',
        label: 'Field text demo',
        demoFunction: fieldTextDemo,
        ctrId: 'field_text_demo',
      },
      {
        icon: 'Flag',
        label: 'Field checkbox demo',
        demoFunction: fieldCheckboxDemo,
        ctrId: 'field_checkbox_demo',
      },
      {
        icon: 'Flag',
        label: 'Field radio demo',
        demoFunction: fieldRadioDemo,
        ctrId: 'field_radio_demo',
      },
      {
        icon: 'Flag',
        label: 'Banner demo',
        demoFunction: bannerDemo,
        ctrId: 'banner_demo',
      },
      {
        icon: 'Flag',
        label: 'Heading demo',
        demoFunction: headingDemo,
        ctrId: 'heading_demo',
      },
      {
        icon: 'Flag',
        label: 'Text demo',
        demoFunction: textDemo,
        ctrId: 'text_demo',
      },
      {
        icon: 'Flag',
        label: 'Paragraph demo',
        demoFunction: paragraphDemo,
        ctrId: 'paragraph_demo',
      },
      {
        icon: 'Flag',
        label: 'Markdown demo',
        demoFunction: markdownDemo,
        ctrId: 'markdown_demo',
      },
      {
        icon: 'Flag',
        label: 'Card demo',
        demoFunction: cardDemo,
        ctrId: 'card_demo',
      },
      {
        icon: 'Flag',
        label: 'Table demo',
        demoFunction: tableDemo,
        ctrId: 'table _demo',
      },
    ]

    _factory.createHeading('UI Components Demo')
    _factory.createContainer('row')
    const sidebar = _factory.createSidebar()
    sidebar.items = []
    sidebar.props = { minWidth: '225px' }
    sidebar.onSelect(onSidebarItemSelect)
    const cardContainer = _factory.createCardContainer()
    cardContainer.id = 'demoCardContainer'
    const validItems: string[] = []
    demos.forEach(demo => {
      const demoCtr = cardContainer.createColumnContainer()
      demoCtr.id = demo.ctrId
      componentHeading(demo.label)
      demo.demoFunction()
      validItems.push(demo.ctrId)
      sidebar.items.push({
        icon: demo.icon,
        label: demo.label,
        id: demo.ctrId,
      })
    })
    const selectItem =
      validItems.find((item) => item === initialItem) || validItems[0]
    sidebar.select(selectItem)
    _factory.render()
  }

  const componentHeading = (label: string, as: string = 'h3') => {
    const heading = _factory.createHeading(label)
    heading.as = as
    heading.props = { my: 'small' }
  }

  const fieldTextDemo = () => {
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
  }

  const bannerDemo = () => {
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
  }

  const fieldCheckboxDemo = () => {
  }

  const fieldRadioDemo = () => {
  }

  const headingDemo = () => {
  }

  const textDemo = () => {
  }

  const paragraphDemo = () => {
  }

  const markdownDemo = () => {
  }

  const cardDemo = () => {
  }

  const tableDemo = () => {
  }

  const onSidebarItemSelect = (itemId: string) => {
    const cardContainer = _factory.findBuilderForId('demoCardContainer') as BannerBuilder
    cardContainer.active = itemId
    _extensionSdk.clientRouteChanged('/' + itemId)
  }

})()
