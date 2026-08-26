/**
 * Backend do Google Apps Script para a página "Processos Atribuídos".
 * Publique este script como aplicativo da Web (Deploy > New deployment > Web app),
 * com "Execute as: Me" e "Who has access: Anyone", e cole a URL gerada
 * na página (botão "Configurar planilha").
 */

var SHEET_NAME = 'Processos';
var HEADERS = [
  'ID', 'Natureza', 'NumeroProcesso', 'Status', 'Distribuicao',
  'Assunto', 'DataRetorno', 'ElaborarVoto', 'CriadoEm', 'AtualizadoEm'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return jsonResponse_({ ok: true, data: [] });
    }
    var values = sheet.getRange(1, 1, lastRow, HEADERS.length).getValues();
    var headers = values[0];
    var rows = values.slice(1).map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) {
        var v = row[i];
        if (v instanceof Date) {
          v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        obj[h] = v;
      });
      return obj;
    }).filter(function (obj) { return obj.ID; });
    return jsonResponse_({ ok: true, data: rows });
  } catch (err) {
    return jsonResponse_({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var sheet = getSheet_();

    if (action === 'create') {
      var id = Utilities.getUuid();
      var now = new Date().toISOString();
      var record = body.record || {};
      sheet.appendRow([
        id,
        record.Natureza || '',
        record.NumeroProcesso || '',
        record.Status || '',
        record.Distribuicao || '',
        record.Assunto || '',
        record.DataRetorno || '',
        record.ElaborarVoto || '',
        now,
        now
      ]);
      return jsonResponse_({ ok: true, id: id });
    }

    if (action === 'update') {
      var updId = body.id;
      var updRecord = body.record || {};
      var rowIndex = findRowById_(sheet, updId);
      if (rowIndex === -1) return jsonResponse_({ ok: false, error: 'Registro não encontrado' });
      sheet.getRange(rowIndex, 2, 1, 7).setValues([[
        updRecord.Natureza || '',
        updRecord.NumeroProcesso || '',
        updRecord.Status || '',
        updRecord.Distribuicao || '',
        updRecord.Assunto || '',
        updRecord.DataRetorno || '',
        updRecord.ElaborarVoto || ''
      ]]);
      sheet.getRange(rowIndex, 10).setValue(new Date().toISOString());
      return jsonResponse_({ ok: true });
    }

    if (action === 'delete') {
      var delId = body.id;
      var delRowIndex = findRowById_(sheet, delId);
      if (delRowIndex === -1) return jsonResponse_({ ok: false, error: 'Registro não encontrado' });
      sheet.deleteRow(delRowIndex);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: 'Ação inválida: ' + action });
  } catch (err) {
    return jsonResponse_({ ok: false, error: err.message });
  }
}

function findRowById_(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  return -1;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
