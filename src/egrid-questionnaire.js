function create(title, items) {
  const form  = FormApp.create(title)
  const sheet = SpreadsheetApp.create(title)
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId())

  const nameText = form.addTextItem()
  nameText.setTitle('氏名')

  const itemsArray    = items.split('\n')
  const questionnaire = form.addGridItem()
  questionnaire
    .setRows(itemsArray)
    .setColumns(['当てはまる', 'やや当てはまる', 'あまり当てはまらない', '当てはまらない']);

  return {
    formPublishUrl: form.getPublishedUrl(),
    formEditUrl:    form.getEditUrl(),
    sheetUrl:       sheet.getUrl(),
  }
}
