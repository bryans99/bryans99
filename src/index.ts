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
import { Looker40SDK } from '@looker/sdk/dist/sdk/4.0/methods'

(function () {
  let _factory: UiBuilderFactory
  let _extensionSdk: ExtensionSDK
  let _core40SDK: Looker40SDK

  connectExtensionHost().then((connectedExtension: ConnectedExtension) => {
    const { initialRoute, extensionSdk, uiBuilderFactory, core40SDK } = connectedExtension
    if (!uiBuilderFactory) {
      const message =
        'UI builder factory not initialized. Check the application definition in the manifest to ensure use_extension_ui is set to yes.'
      console.error(message)
      throw new Error(message)
    }
    _extensionSdk = extensionSdk
    _factory = uiBuilderFactory as UiBuilderFactory
    _core40SDK = core40SDK
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
        label: 'Button demo',
        demoFunction: buttonDemo,
        ctrId: 'button_demo',
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

    _factory.createHeading('Simple UI Components Demo')
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
  }

  const fieldTextDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide', 'right')
    const readonlyCheckbox = _factory.createFieldCheckbox('Readonly', 'right')
    const requiredCheckbox = _factory.createFieldCheckbox('Required ', 'right')
    _factory.popContainer()
    const fieldText = _factory.createFieldText('Field text')
    fieldText.width = '100%'
    const fieldTextValue = _factory.createFieldText('Field text value')
    fieldTextValue.bind(fieldText)
    fieldTextValue.width = '100%'
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

  const buttonDemo = () => {
    _factory.createParagraph(`
      Click the button to update the button count.
    `)
    _factory
      .createButton("Button has been pressed {{default.buttonDemo}} times!")
      .onClick(() => {
        const clickCount = _factory.getModelValue('default', 'buttonDemo')
        _factory.updateModelValue('default', 'buttonDemo', clickCount + 1)
      })
      .id = 'buttonDemo'
    _factory.updateModelValue('default', 'buttonDemo', 0)
  }

  const headingDemo = () => {
    componentHeading("Default Heading", "")
    componentHeading("H1 Heading", "h1")
    componentHeading("H2 Heading", "h2")
    componentHeading("H3 Heading", "h3")
    componentHeading("H4 Heading", "h4")
    componentHeading("H5 Heading", "h5")
    componentHeading("H6 Heading", "h6")
    componentHeading("Dynamic Heading '{{default.headingUpdater}}'")
    _factory.createFieldText('Update heading').id = 'headingUpdater'
  }

  const textDemo = () => {
    _factory.createText(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    `)
    _factory.createText(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    `)
    _factory.createText("Dynamic text '{{default.textUpdater}}'")
    _factory.createFieldText('Update text').id = 'textUpdater'
  }

  const paragraphDemo = () => {
    _factory.createParagraph(`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    Proin cursus magna urna, vel pulvinar elit ornare eu. Pellentesque habitant morbi
    tristique senectus et netus et malesuada fames ac turpis egestas. Quisque risus ante,
    congue et metus ac, euismod ullamcorper purus. Nulla varius nec justo id dictum.
    Nulla facilisi. Integer viverra mattis orci. Aenean nec felis non sem porttitor
    volutpat. Pellentesque vestibulum ex quis quam gravida, id pharetra turpis vulputate.
    Aenean pulvinar eget turpis quis bibendum. Nam pulvinar dolor non elit
    molestie lobortis. Nam vel fringilla leo, a vestibulum nulla.
  `)
  _factory.createParagraph(`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    Proin cursus magna urna, vel pulvinar elit ornare eu. Pellentesque habitant morbi
    tristique senectus et netus et malesuada fames ac turpis egestas. Quisque risus ante,
    congue et metus ac, euismod ullamcorper purus. Nulla varius nec justo id dictum.
    Nulla facilisi. Integer viverra mattis orci. Aenean nec felis non sem porttitor
    volutpat. Pellentesque vestibulum ex quis quam gravida, id pharetra turpis vulputate.
    Aenean pulvinar eget turpis quis bibendum. Nam pulvinar dolor non elit
    molestie lobortis. Nam vel fringilla leo, a vestibulum nulla.
  `)
  _factory.createParagraph("Dynamic paragraph '{{default.paragraphUpdater}}'")
  _factory.createFieldText('Update paragraph').id = 'paragraphUpdater'
}

  const markdownDemo = () => {
    _factory.createMarkdown(`
# Markdown demo

## Markdown Paragraph
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
Proin cursus magna urna, vel pulvinar elit ornare eu. Pellentesque habitant morbi
tristique senectus et netus et malesuada fames ac turpis egestas. Quisque risus ante,
congue et metus ac, euismod ullamcorper purus. Nulla varius nec justo id dictum.
Nulla facilisi. Integer viverra mattis orci. Aenean nec felis non sem porttitor
volutpat. Pellentesque vestibulum ex quis quam gravida, id pharetra turpis vulputate.
Aenean pulvinar eget turpis quis bibendum. Nam pulvinar dolor non elit
molestie lobortis. Nam vel fringilla leo, a vestibulum nulla.

## Shopping list for a heart attack special

- Eggs
- Bacon
- Black pudding
- Mushrooms
- Fried bread
- Bake beans

[Find out more](http://google.com/?q=full+monty+english+breakfast)
    `)
    _factory.createMarkdown("Dynamic markdown '{{default.markdownUpdater}}'")
    _factory.createFieldText('Update markdown').id = 'markdownUpdater'
    }

  const cardDemo = () => {
    _factory.createCard().heading = "Card heading"
    _factory.createParagraph(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
Proin cursus magna urna, vel pulvinar elit ornare eu. Pellentesque habitant morbi
tristique senectus et netus et malesuada fames ac turpis egestas. Quisque risus ante,
congue et metus ac, euismod ullamcorper purus. Nulla varius nec justo id dictum.
Nulla facilisi. Integer viverra mattis orci. Aenean nec felis non sem porttitor
volutpat. Pellentesque vestibulum ex quis quam gravida, id pharetra turpis vulputate.
Aenean pulvinar eget turpis quis bibendum. Nam pulvinar dolor non elit
molestie lobortis. Nam vel fringilla leo, a vestibulum nulla.
      `)
    }

  const tableDemo = () => {
    const banner = _factory.createBanner()
    const table = _factory.createTable()
    table.columns = [
      {name: "id", heading: "Look ID"},
      {name: "title", heading: "Look Title"},
    ]
    _core40SDK.all_looks()
      .then(result => {
        if (result.ok) {
          _factory.updateModelValue('default', table.id, result.value)
        } else {
          banner.error = "Error retrieving looks"
        }
      })
    }

  const onSidebarItemSelect = (itemId: string) => {
    const cardContainer = _factory.findBuilderForId('demoCardContainer') as BannerBuilder
    cardContainer.active = itemId
    _extensionSdk.clientRouteChanged('/' + itemId)
  }

})()
