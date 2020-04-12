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
  ButtonBuilder,
  UiBuilder,
  ChoiceContainerBuilder,
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
        label: 'Card container demo',
        demoFunction: cardContainerDemo,
        ctrId: 'card_container_demo',
      },
      {
        icon: 'Flag',
        label: 'Table demo',
        demoFunction: tableDemo,
        ctrId: 'table_demo',
      },
    ]

    _factory.createHeading('Simple UI Components Demo')
    _factory.createContainer('row')
    const sidebar = _factory.createSidebar()
      .withItems([])
      .withProps({ minWidth: '225px' })
      .onSelect(onSidebarItemSelect)
    const choiceContainer = _factory.createChoiceContainer()
      .withId('demoChoiceContainer')
    const validItems: string[] = []
    demos.forEach(demo => {
      choiceContainer.createColumnContainer()
        .withId(demo.ctrId)
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
    return _factory.createHeading(label).withAs(as)
  }

  const fieldTextDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide', 'right')
    const readonlyCheckbox = _factory.createFieldCheckbox('Readonly', 'right')
    const requiredCheckbox = _factory.createFieldCheckbox('Required ', 'right')
    _factory.popContainer()
    const fieldText = _factory.createFieldText('Field text')
      .withWidth('100%')
    _factory.createFieldText('Field text value')
      .bind(fieldText)
      .withWidth('100%')
      .withReadonly(true)
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
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide static banners', 'right')
    _factory.popContainer()
    const intents: BannerIntent[] = ['error', 'warning', 'info', 'confirmation']
    intents.forEach(
      (intent: BannerIntent) => {
        _factory.createBanner()
          .withText(`Static ${intent}`)
          .withIntent(intent)
          .withId(`static_banner_${intent}`)
      }
    )
    hideCheckbox.onChange((value: boolean) => {
      intents.forEach(
        (intent: BannerIntent) => {
          (_factory.getBuilder(`static_banner_${intent}`) as BannerBuilder).hidden = value
        }
      )
    })
    componentHeading('Dynamic banner', 'h4')
    _factory.createRowContainer()
    const updateDynamicBanner = (radioId: string, builder: UiBuilder) => {
      if (radioId === builder.id) {
        const banner: BannerBuilder = _factory.getBuilder('dynamicBanner') as BannerBuilder
        if (banner) {
          if (radioId === 'none') {
            banner.clearMessage()
          } else  {
            (banner as any)[radioId] = `Display an ${radioId} message`
          }
        }
      }
    }
    _factory.createFieldRadio('bannerType', 'None')
      .onChange(updateDynamicBanner)
      .withId('none')
    intents.forEach(
      (intent: BannerIntent) => {
        _factory.createFieldRadio('bannerType', intent.charAt(0).toUpperCase() + intent.substring(1))
          .onChange(updateDynamicBanner)
          .withId(intent)
      }
    )
    _factory.popContainer()
    _factory.createBanner().withId('dynamicBanner')
  }

  const fieldCheckboxDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide', 'right')
    const readonlyCheckbox = _factory.createFieldCheckbox('Readonly', 'right')
    const requiredCheckbox = _factory.createFieldCheckbox('Required ', 'right')
    _factory.popContainer()
    const field = _factory.createFieldCheckbox('Field checkbox')
    _factory.createFieldText('Field checkbox value')
      .bind(field)
      .withWidth('100%')
      .withReadonly(true)
    hideCheckbox.onChange((value: boolean) => {
      field.hidden = value
    })
    readonlyCheckbox.onChange((value: boolean) => {
      field.readonly = value
    })
    requiredCheckbox.onChange((value: boolean) => {
      field.required = value
    })
  }

  const fieldRadioDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide', 'right')
    const readonlyCheckbox = _factory.createFieldCheckbox('Readonly', 'right')
    const requiredCheckbox = _factory.createFieldCheckbox('Required ', 'right')
    _factory.popContainer()
    _factory.createRowContainer()
    const radio1 = _factory.createFieldRadio('radioValue', 'Radio 1')
      .withId('radio1')
    const radio2 = _factory.createFieldRadio('radioValue', 'Radio 2')
      .withId('radio2')
    _factory.popContainer()
    const fieldTextValue = _factory.createFieldText('Field checkbox value')
      .withWidth('100%')
      .withReadonly(true)
    const updateValue = (radioId: string, builder: UiBuilder) => {
      if (radioId === builder.id) {
        fieldTextValue.value = radioId
      }
    }
    radio1.onChange(updateValue)
    radio2.onChange(updateValue)
    hideCheckbox.onChange((value: boolean) => {
      radio1.hidden = value
      radio2.hidden = value
    })
    readonlyCheckbox.onChange((value: boolean) => {
      radio1.readonly = value
      radio2.readonly = value
    })
    requiredCheckbox.onChange((value: boolean) => {
      radio1.required = value
      radio2.required = value
    })
  }

  const buttonDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide', 'right')
    const disabledCheckbox = _factory.createFieldCheckbox('Disabled', 'right')
    _factory.popContainer()
    _factory.createParagraph(`
      Click the button to update the button count.
    `)
    const button: ButtonBuilder = _factory
      .createButton("Button has been pressed {{default.buttonDemo}} times!")
      .onClick(() => {
        const clickCount = _factory.getModelValue('default', 'buttonDemo')
        _factory.updateModelValue('default', 'buttonDemo', clickCount + 1)
      })
      .withId('buttonDemo')
    _factory.updateModelValue('default', 'buttonDemo', 0)
    _factory.createButton("Transparent button", "transparent")
    _factory.createButton("Outline button", "outline")
    hideCheckbox.onChange((value: boolean) => {
      button.hidden = value
    })
    disabledCheckbox.onChange((value: boolean) => {
      button.disabled = value
    })
  }

  const headingDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide default heading', 'right')
    _factory.popContainer()
    const defaultHeading = componentHeading("Default Heading", "")
    hideCheckbox.onChange((value: boolean) => {
      defaultHeading.hidden = value
    })
    componentHeading("H1 Heading", "h1")
    componentHeading("H2 Heading", "h2")
    componentHeading("H3 Heading", "h3")
    componentHeading("H4 Heading", "h4")
    componentHeading("H5 Heading", "h5")
    componentHeading("H6 Heading", "h6")
    componentHeading("Dynamic Heading '{{default.headingUpdater}}'")
    _factory.createFieldText('Update heading').withId('headingUpdater')
  }

  const textDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide text', 'right')
    _factory.popContainer()
    const comp = _factory.createText(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    `)
    hideCheckbox.onChange((value: boolean) => {
      comp.hidden = value
    })
    _factory.createText(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    `)
    _factory.createText("Dynamic text '{{default.textUpdater}}'")
    _factory.createFieldText('Update text').id = 'textUpdater'
  }

  const paragraphDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide paragraph', 'right')
    _factory.popContainer()
    const comp = _factory.createParagraph(`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet nulla tellus.
    Proin cursus magna urna, vel pulvinar elit ornare eu. Pellentesque habitant morbi
    tristique senectus et netus et malesuada fames ac turpis egestas. Quisque risus ante,
    congue et metus ac, euismod ullamcorper purus. Nulla varius nec justo id dictum.
    Nulla facilisi. Integer viverra mattis orci. Aenean nec felis non sem porttitor
    volutpat. Pellentesque vestibulum ex quis quam gravida, id pharetra turpis vulputate.
    Aenean pulvinar eget turpis quis bibendum. Nam pulvinar dolor non elit
    molestie lobortis. Nam vel fringilla leo, a vestibulum nulla.
  `)
    hideCheckbox.onChange((value: boolean) => {
      comp.hidden = value
    })
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
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide markdown', 'right')
    _factory.popContainer()
    const comp = _factory.createMarkdown(`
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
    hideCheckbox.onChange((value: boolean) => {
      comp.hidden = value
    })
    _factory.createMarkdown("Dynamic markdown '{{default.markdownUpdater}}'")
    _factory.createFieldText('Update markdown').id = 'markdownUpdater'
  }

  const cardContainerDemo = () => {
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide card container', 'right')
    _factory.popContainer()
    const comp = _factory.createCardContainer()
      .withHeading("Card container heading")
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
      hideCheckbox.onChange((value: boolean) => {
        comp.hidden = value
      })
  }

  const tableDemo = () => {
    const banner = _factory.createBanner()
    _factory.createRowContainer()
    const hideCheckbox = _factory.createFieldCheckbox('Hide table', 'right')
    _factory.popContainer()
    const table = _factory.createTable()
      .withColumns([
        {name: "id", heading: "Look ID"},
        {name: "title", heading: "Look Title"},
      ])
      .on('activate', () => {
        _core40SDK.all_looks()
        .then(result => {
          if (result.ok) {
            _factory.updateModelValue('default', table.id, result.value)
          } else {
            banner.error = "Error retrieving looks"
          }
        })
      })
      .on('deactivate', () => {
        _factory.updateModelValue('default', table.id, undefined)
      })
    hideCheckbox.onChange((value: boolean) => {
      table.hidden = value
    })
  }

  const onSidebarItemSelect = (itemId: string) => {
    const choiceContainer = _factory.getBuilder('demoChoiceContainer') as ChoiceContainerBuilder
    choiceContainer.active = itemId
    _extensionSdk.clientRouteChanged('/' + itemId)
  }

})()
