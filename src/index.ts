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
  connectExtensionHost,
  ConnectedExtension,
  ExtensionSDK,
  UiBuilderFactory,
  BannerBuilder,
  SidebarBuilder,
  TableBuilder
} from '@looker/extension-sdk'
import { Looker40SDK } from '@looker/sdk/dist/sdk/4.0/methods'
import { ILook } from '@looker/sdk/dist/sdk/4.0/models'

(function() {
  let _factory: UiBuilderFactory
  let _extensionSdk: ExtensionSDK
  let _currentRoute: string
  let _sidebar: SidebarBuilder
  // let _banner: BannerBuilder
  // let _table: TableBuilder
  // let _currentLookId: number
  // let _looks: ILook[]

  connectExtensionHost().then((connectedExtension: ConnectedExtension) => {
    const { initialRoute, extensionSdk, uiBuilderFactory } = connectedExtension
    _extensionSdk = extensionSdk
    _factory = uiBuilderFactory as UiBuilderFactory
    _currentRoute = initialRoute || ''
    app()
  })

  const app = () => {
    _factory.createHeading('UI Components Demo')
    _factory.createContainer('row')
    _sidebar = _factory.createSidebar()
    _sidebar.items = [
      { icon: 'Flag', label: 'Component state'}
    ]
    fieldTextDemo()
    // factory.createContainer('column').props = { height: '100vh' }
    // factory.createHeading("Welcome to the Looker Extension Template")
    // _banner = factory.createBanner()
    // factory.createContainer('row')
    // _sidebar.onSelect(onSidebarSelect)
    // _sidebar.headingIcon = "Flag"
    // _sidebar.headingLabel = "Available Looks"
    // _sidebar.props = { width: '200px' }
    // factory.createContainer().props = { overflow: 'scroll' }
    // _table = factory.createTable()
    _factory.render()
    // getLooks()
  }

  const componentHeading = (label: string) => {
    const heading = _factory.createHeading(label)
    heading.as = 'h3'
    heading.props = { my: 'small' }
  }

  const fieldTextDemo = () => {
    const ctr = _factory.createContainer('column')
    componentHeading('Field Text')
    const stateCtr = _factory.createContainer('row')
    const hideCheckbox = stateCtr.createFieldCheckbox('Hide', 'right')
    const readonlyCheckbox = stateCtr.createFieldCheckbox('Readonly', 'right')
    const requiredCheckbox = stateCtr.createFieldCheckbox('Required ', 'right')
    const fieldText = ctr.createFieldText('Field text', 'left')
    fieldText.width = '400px'
    const fieldTextValue = ctr.createFieldText('Field text value', 'left')
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

  // const onSidebarSelect = (itemId: string) => {
  //   if (_looks.find(look => look.id === Number(itemId))) {
  //     runLook(Number(itemId))
  //   } else {
  //     _banner.error = "Could not find requested look"
  //   }
  // }

  // const getLooks = async () => {
  //   try {
  //     _banner.clearMessage()
  //     _looks = await _core40SDK.ok(_core40SDK.all_looks())
  //     _sidebar.value = _looks.map((look) => ({id: look.id, label: look.title, icon: 'Folder'}))
  //     if (_looks.length === 0) {
  //       _table.value = []
  //       _banner.error = "No looks available"
  //     } else {
  //       if (_looks.find(look => look.id === _currentLookId)) {
  //         runLook(_currentLookId)
  //         _sidebar.select(_currentLookId)
  //       } else {
  //         if (_looks[0].id) {
  //           runLook(_looks[0].id)
  //           _sidebar.select(_looks[0].id)
  //         } else {
  //           _table.value = []
  //         }
  //       }
  //     }
  //   }
  //   catch(err) {
  //     _banner.error = "A problem occured reading all looks"
  //   }
  // }

  // const runLook = async (lookId: number) => {
  //   try {
  //     _banner.clearMessage()
  //     _extensionSdk.clientRouteChanged('/' + lookId)
  //     const result = await _core40SDK.ok(_core40SDK.run_look({look_id: lookId, result_format: 'json'}))
  //     _table.value = result
  //   }
  //   catch(err) {
  //     _banner.error = "A problem occured reading look " + lookId
  //   }
  // }
})()