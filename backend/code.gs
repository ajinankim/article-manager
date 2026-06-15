function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 데이터 추가: [사용자 이름, 기사 링크, 타임스탬프]
  sheet.appendRow([data.userName, data.articleUrl, new Date()]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Data saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}
