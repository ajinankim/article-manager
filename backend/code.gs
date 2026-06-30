function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // 첫 번째 행은 헤더로 가정
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    return {
      title: row[0],
      userName: row[1],
      category: row[2],
      summary: row[3],
      timestamp: row[4],
      articleUrl: row[5]
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
  var threads = GmailApp.search("subject:[기사등록] -label:" + labelName);
  
  if (threads.length === 0) {
    // 대체 검색어 시도 (기존 데이터 호환)
    threads = GmailApp.search("subject:[기사링크전송] -label:" + labelName);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      var subject = message.getSubject();
      if (subject.includes("[기사등록]") || subject.includes("[기사링크전송]")) {
        var body = message.getPlainBody();
        var lines = body.split('\n');
        var articleUrl = "";
        
        // URL 추출 시도
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line.startsWith("http")) {
            articleUrl = line;
            break;
          }
        }

        if (articleUrl) {
          var userName = message.getFrom().split('<')[0].replace(/"/g, '').trim();
          var summary = "내용 확인 중..."; // 기본값
          var category = "기타"; // 기본값

          // 본문에 구조화된 데이터가 있는지 확인
          // 예: [카테고리] 기술 [요약] 내용...
          var categoryMatch = body.match(/\[카테고리\]\s*(.*)/);
          var summaryMatch = body.match(/\[요약\]\s*(.*)/);
          
          if (categoryMatch) category = categoryMatch[1].trim();
          if (summaryMatch) summary = summaryMatch[1].trim();
          
          // 기존 시트 구조: [작성자, 링크, 요약, 타임스탬프]
          // 요청한 새로운 구조: [제목(사용자), 카테고리, 요약, 링크, 타임스탬프]
          // 일단 기존 구조를 유지하되 컬럼을 확장하거나 매핑을 조정할 필요가 있음
          // 요청에 따라: 기사제목, 기사카테고리, 기사내용 요약, 기사링크 순으로 저장
          sheet.appendRow([userName, category, summary, articleUrl, new Date()]);
          thread.addLabel(label);
        }
      }
    });
  });
}
