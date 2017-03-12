function getJson(url) {
  const spreadsheet = SpreadsheetApp.openByUrl(url)
  const sheet = spreadsheet.getSheets()[0];
  const range = sheet.getDataRange();
  const values = range.getValues();

  const map = {
    '当てはまる': 3,
    'やや当てはまる': 2,
    'あまり当てはまらない': 1,
    '当てはまらない': 0
  }

  const items = []
  let i, j
  for (i = 1; i < values.length; ++i) {
    const obj = {}
    for (j = 1; j < values[i].length; ++j) {
      const head = values[0][j]
      obj[head.slice(2, head.length - 1)] = map[values[i][j]]
    }
    items.push(obj)
  }

  return JSON.stringify(items)
}
