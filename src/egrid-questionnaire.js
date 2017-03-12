function doGet(e) {
  if (!e.parameters.items) {
    return ContentService.createTextOutput('OK');
  }
  var title = e.parameters.title;
  var form = FormApp.create(title);
  var sheet = SpreadsheetApp.create(title);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  var questionnaire = form.addGridItem();
  questionnaire
    .setRows(e.parameters.items)
    .setColumns(['当てはまる', 'やや当てはまる', 'あまり当てはまらない', '当てはまらない']);

  var callback = e.parameters.callback;
  var content = JSON.stringify({
    formUrl: form.getPublishedUrl(),
    formEditUrl: form.getEditUrl(),
    sheetUrl: sheet.getUrl()
  });
  if (callback) {
    content = callback + '(' + content + ')';
  }
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
