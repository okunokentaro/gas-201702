let questionnaireSubmitElem // HTMLElement
let titleElem // HTMLElement
let itemsElem // HTMLElement
let urlElem // HTMLElement

const googleApisRoot = 'https://script.googleapis.com'

const scope = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/forms',
].join(' ')

const configs = {
  questionnaire: {
    apiId:    'M8q7xLgGACBCmy5SJER6RiaMQeXE4HVlN',
    clientId: '82544417006-7ij3kh1bgve74gp0g7fqvhaf72pq2fe6.apps.googleusercontent.com',
    functionName: 'create',
  },
  spreadsheet: {
    apiId:    'MKqlNvaESBD7vMuJXZieE-KMQeXE4HVlN',
    clientId: '582745044833-qm13neu8eh507deidr6cq3phkmn4jaro.apps.googleusercontent.com',
    functionName: 'getJson',
  },
}

/**
 *
 * @param {string} apiId
 */
const getPath = (apiId) => {
  return `v1/scripts/${apiId}:run`
}

/**
 * @param {Object} err - Error Object https://goo.gl/hSH4V8
 */
const handleError = (err) => {
  if (!Array.isArray(err.details)) {
    console.error(`${err.code} [${err.status}] ${err.message}`)
    return
  }
  err.details.forEach(d => {
    console.error(`[${d.errorType}] ${d.errorMessage}
    stack: ${JSON.stringify(d.scriptStackTraceElements)}`)
  })
}

const clearInputs = () => {
  titleElem.value = ''
  itemsElem.value = ''
  questionnaireSubmitElem.innerText = '送信'
  questionnaireSubmitElem.removeAttribute('disabled')
}

const renderLoadingButton = () => {
  questionnaireSubmitElem.innerText = '送信中'
  questionnaireSubmitElem.setAttribute('disabled', 'disabled')
}

const renderQuestionnaireResult = (result) => {
  const resultElem = document.querySelector('#questionnaire-result')
  resultElem.innerHTML = `
    <div class="sixteen wide column">
      <ul>
        <li><a href="${result.formPublishUrl}">Form</a></li>
        <li><a href="${result.formEditUrl}">Form編集</a></li>
        <li><a href="${result.sheetUrl}">Spreadsheet</a></li>
      </ul>
      <pre>${result.sheetUrl}</pre>
    </div>
  `
}

const renderSpreadsheetResult = (result) => {
  const resultElem = document.querySelector('#spreadsheet-result')
  resultElem.innerHTML = `
    <div class="sixteen wide column">
      <pre>${result}</pre>
    </div>
  `
}

/**
 * @param {{title: string, items.string}} obj
 */
const callQuestionnaire = (obj) => {
  const request = gapi.client.request({
    root: googleApisRoot,
    path: getPath(configs.questionnaire.apiId),
    method: 'POST',
    body: {
      function:   configs.questionnaire.functionName,
      parameters: [obj.title, obj.items],
      devMode:    true,
    }
  })

  request.execute((res) => {
    if (res.error) {
      handleError(res.error)
      return
    }
    clearInputs()
    renderQuestionnaireResult(res.response.result)
  })
}

/**
 * @param {{url: string}} obj
 */
const callSpreadsheet = (obj) => {
  const request = gapi.client.request({
    root: googleApisRoot,
    path: getPath(configs.spreadsheet.apiId),
    method: 'POST',
    body: {
      function:   configs.spreadsheet.functionName,
      parameters: [obj.url],
      devMode:    true,
    }
  })

  request.execute((res) => {
    if (res.error) {
      handleError(res.error)
      return
    }

    renderSpreadsheetResult(res.response.result)
  })
}

const getValuesForQuestionnaire = (formElem) => {
  titleElem   = formElem.querySelector('[name="title"]')
  const title = titleElem.value

  itemsElem   = formElem.querySelector('[title="items"]')
  const items = itemsElem.value

  return {title, items}
}

const getValuesForSpreadsheet = (formElem) => {
  urlElem   = formElem.querySelector('[name="url"]')
  const url = urlElem.value

  return {url}
}

const main = () => {
  questionnaireSubmitElem = document.querySelector('#create-questionnaire-submit')

  const questionnaireAuthData = {
    client_id: configs.questionnaire.clientId,
    immediate: false,
    scope,
  }

  const spreadsheetAuthData = {
    client_id: configs.spreadsheet.clientId,
    immediate: false,
    scope,
  }

  const questionnaireForm = window.document.querySelector('#create-questionnaire')
  questionnaireForm.addEventListener('submit', ev => {
    ev.preventDefault()

    window.gapi.auth.authorize(questionnaireAuthData, () => {
      renderLoadingButton()
      callQuestionnaire(getValuesForQuestionnaire(questionnaireForm))
    })
  })

  const spreadsheetForm = window.document.querySelector('#get-spreadsheet')
  spreadsheetForm.addEventListener('submit', ev => {
    ev.preventDefault()

    window.gapi.auth.authorize(spreadsheetAuthData, () => {
      callSpreadsheet(getValuesForSpreadsheet(spreadsheetForm))
    })
  })
}

window.addEventListener('load', main)
