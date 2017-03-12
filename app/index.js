let submitButtonElem // HTMLElement
let titleElem // HTMLElement
let itemsElem // HTMLElement

const scope = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/forms',
].join(' ')

const tokens = {
  questionnaire: {
    apiId:    'M8q7xLgGACBCmy5SJER6RiaMQeXE4HVlN',
    clientId: '82544417006-7ij3kh1bgve74gp0g7fqvhaf72pq2fe6.apps.googleusercontent.com',
  },
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
  submitButtonElem.innerText = '送信'
  submitButtonElem.removeAttribute('disabled')
}

const renderResult = (result) => {
  const resultElem = document.querySelector('#result')
  resultElem.innerHTML = `
    <div class="sixteen wide column">
      <ul>
        <li><a href="${result.formPublishUrl}">Form</a></li>
        <li><a href="${result.formEditUrl}">Form編集</a></li>
        <li><a href="${result.sheetUrl}">Spreadsheet</a></li>
      </ul>
    </div>
  `
}

/**
 * @param {string} title
 * @param {string} items
 */
const callGas = (title, items) => {
  const request = gapi.client.request({
    root: 'https://script.googleapis.com',
    path: `v1/scripts/${tokens.questionnaire.apiId}:run`,
    method: 'POST',
    body: {
      function:   'create',
      parameters: [title, items],
      devMode:    true,
    }
  })

  request.execute((res) => {
    if (res.error) {
      handleError(res.error)
      return
    }
    clearInputs()
    renderResult(res.response.result)
  })
}

const main = () => {
  const authData = {
    client_id: tokens.questionnaire.clientId,
    immediate: false,
    scope,
  }

  const form = window.document.querySelector('#create-questionnaire')
  form.addEventListener('submit', ev => {
    ev.preventDefault()

    submitButtonElem = document.querySelector('#submit')

    titleElem   = form.querySelector('[name="title"]')
    const title = titleElem.value

    itemsElem   = form.querySelector('[title="items"]')
    const items = itemsElem.value

    window.gapi.auth.authorize(authData, () => {
      submitButtonElem.innerText = '送信中'
      submitButtonElem.setAttribute('disabled', 'disabled')
      callGas(title, items)
    })
  })
}

window.addEventListener('load', main)
