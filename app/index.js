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

const callGas = () => {
  const request = gapi.client.request({
    root: 'https://script.googleapis.com',
    path: `v1/scripts/${tokens.questionnaire.apiId}:run`,
    method: 'POST',
    body: {
      function:   'hoge',
      parameters: ['titletitletitle', 'item1\nitem2\nitem3'],
      devMode:    true,
    }
  })

  request.execute((res) => {
    if (res.error) {
      if (!Array.isArray(res.error.details)) {
        console.error(`${res.error.code} [${res.error.status}] ${res.error.message}`)
        return
      }
      res.error.details.forEach(d => {
        console.error(`[${d.errorType}] ${d.errorMessage}\nstack: ${JSON.stringify(d.scriptStackTraceElements)}`)
      })
      return
    }
    console.log(JSON.stringify(res.response.result))
  })
}

const main = () => {
  const authData = {
    client_id: tokens.questionnaire.clientId,
    immediate: false,
    scope,
  }

  window.gapi.auth.authorize(authData, authResult => {
    callGas()
  })
}

