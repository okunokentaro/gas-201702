function doGet(e) {
  if (!e.parameters.url) {
    return ContentService.createTextOutput('OK');
  }
  var spreadsheet = SpreadsheetApp.openByUrl(e.parameters.url);
  var sheet = spreadsheet.getSheets()[0];
  var range = sheet.getDataRange();
  var values = range.getValues();

  var map = {
    '当てはまる': 3,
    'やや当てはまる': 2,
    'あまり当てはまらない': 1,
    '当てはまらない': 0
  }
  var items = [];
  var i, j;
  for (i = 1; i < values.length; ++i) {
    var obj = {};
    for (j = 1; j < values[i].length; ++j) {
      var head = values[0][j];
      obj[head.slice(2, head.length - 1)] = map[values[i][j]];
    }
    items.push(obj);
  }

  var callback = e.parameters.callback;
  var content = JSON.stringify({
    items: items
  });
  if (callback) {
    content = callback + '(' + content + ')';
  }
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
