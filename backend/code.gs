function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // 첫 번째 행은 헤더로 가정
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    return {
      title: row[0],      // 기사제목
      userName: row[1],   // 보낸사람
      category: row[2],   // 카테고리
      summary: row[3],    // 기사요약(3줄)
      timestamp: row[4],  // 날짜
      articleUrl: row[5], // 링크
      imageUrl: row[6]    // 이미지 (G컬럼)
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var action = e.parameter.action;
  
  if (action === 'processEmails') {
    processGmailEmails();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Emails processed and sheet updated'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 직접 데이터 추가 시 (API용)
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.title, 
      data.userName, 
      data.category, 
      data.summary, 
      new Date(), 
      data.articleUrl,
      data.imageUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 이메일에서 기사 읽어서 시트 업데이트
function processGmailEmails() {
  var labelName = "Processed_Articles";
  var label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);
  
  // [기사등록] 또는 [기사링크전송] 제목 찾기
  var threads = GmailApp.search("subject:[기사등록] -label:" + labelName);
  if (threads.length === 0) {
    threads = GmailApp.search("subject:[기사링크전송] -label:" + labelName);
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      if (message.isUnread()) {
        var subject = message.getSubject();
        var body = message.getPlainBody();
        var articleUrl = "";
        
        // URL 추출
        var urlMatch = body.match(/https?:\/\/[^\s]+/);
        if (urlMatch) articleUrl = urlMatch[0];

        if (articleUrl) {
          // 작성자 이름 추출
          var userName = message.getFrom().split('<')[0].replace(/"/g, '').trim();
          var title = subject.replace("[기사등록]", "").replace("[기사링크전송]", "").trim();
          var summary = "내용을 분석 중입니다..."; 
          var category = "기타";
          var imageUrl = ""; // 기본값 (추후 AI나 크롤링으로 보강 가능)

          // 본문 태그 분석 ([카테고리] 및 [요약])
          var categoryMatch = body.match(/\[카테고리\]\s*(.*)/);
          var summaryMatch = body.match(/\[요약\]\s*(.*)/);
          
          if (categoryMatch) category = categoryMatch[1].trim();
          if (summaryMatch) summary = summaryMatch[1].trim();
          
          // 시트 순서: [기사제목, 보낸사람, 카테고리, 기사요약(3줄), 날짜, 링크, 이미지]
          sheet.appendRow([title, userName, category, summary, new Date(), articleUrl, imageUrl]);
          
          thread.addLabel(label);
          message.markRead();
        }
      }
    });
  });
}
