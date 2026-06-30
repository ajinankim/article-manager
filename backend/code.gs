function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // 첫 번째 행은 헤더로 가정
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    return {
      userName: row[0],
      articleUrl: row[1],
      summary: row[2], // 요약 데이터
      timestamp: row[3]
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (action === 'processEmails') {
    processGmailEmails();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Emails processed and sheet updated'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  var data = JSON.parse(e.postData.contents);
  // 데이터 추가: [사용자 이름, 기사 링크, 요약, 타임스탬프]
  sheet.appendRow([data.userName, data.articleUrl, data.summary, new Date()]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Data saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 이메일에서 기사 링크 공유 확인 및 시트 업데이트
function processGmailEmails() {
  var labelName = "Processed_Articles";
  var label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);
  var threads = GmailApp.search("subject:[기사링크공유] -label:" + labelName);
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      if (message.getSubject().includes("[기사링크공유]")) {
        var body = message.getPlainBody();
        // 간단한 파싱 로직 (필요에 따라 정규식 수정/강화)
        // 가정: 본문에 [사용자] [링크] [요약] 순서로 있거나, 정형화된 데이터
        // 여기서는 임시 테스트용 파싱
        var userName = "Unknown";
        var articleUrl = "https://example.com";
        var summary = body.substring(0, 50); // 본문 일부
        
        sheet.appendRow([userName, articleUrl, summary, new Date()]);
        thread.addLabel(label);
      }
    });
  });
}
