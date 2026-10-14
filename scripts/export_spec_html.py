from pathlib import Path
from html import escape
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table
root=Path(__file__).resolve().parents[1]
doc=Document(root/'docs/Winbuzz-website-specification.docx')
parts=[]
for el in doc.element.body:
 if el.tag.endswith('}p'):
  p=Paragraph(el,doc);text=escape(p.text).replace('\n','<br>')
  if not text:continue
  style=p.style.name
  tag='h1' if style=='Title' else 'h2' if style=='Heading 1' else 'h3' if style=='Heading 2' else 'p'
  if tag=='p' and p.runs and all(r.bold for r in p.runs):text='<strong>'+text+'</strong>'
  parts.append(f'<{tag}>{text}</{tag}>')
 elif el.tag.endswith('}tbl'):
  t=Table(el,doc);rows=[]
  for i,row in enumerate(t.rows):
   tag='th' if i==0 else 'td';rows.append('<tr>'+''.join(f'<{tag}>{escape(c.text)}</{tag}>' for c in row.cells)+'</tr>')
  parts.append('<table><thead>'+rows[0]+'</thead><tbody>'+''.join(rows[1:])+'</tbody></table>')
html='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Winbuzz website replica specification</title><style>
body{font:15px/1.6 Arial,sans-serif;color:#171b23;background:#edf0f4;margin:0}main{max-width:960px;margin:40px auto;background:white;padding:64px}h1{font-size:34px;line-height:1.2;margin:0 0 24px}h2{font-size:24px;margin:44px 0 14px}h3{font-size:18px;margin:28px 0 8px}p{margin:0 0 14px;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;font-size:13px;margin:20px 0 28px}th,td{padding:10px 12px;text-align:left;border:1px solid #cbd2db;vertical-align:top;overflow-wrap:anywhere}th{background:#e9eef3}tr{break-inside:avoid}h1,h2,h3{break-after:avoid}nav{position:sticky;top:0;background:#171b23;color:white;padding:10px 24px}nav a{color:white;margin-right:20px}button{cursor:pointer;padding:8px 14px} @media(max-width:700px){main{padding:24px;margin:16px}table{table-layout:fixed}}@media print{body{background:white;font-size:10pt}nav{display:none}main{padding:0;max-width:none;margin:0}table{font-size:9pt}h2{margin-top:24px}thead{display:table-header-group}@page{margin:18mm}}
</style></head><body><nav><a href="#">Specification</a><button onclick="window.print()">Print or save PDF</button></nav><main>'''+''.join(parts)+'''</main></body></html>'''
(root/'docs/Winbuzz-website-specification.html').write_text(html,encoding='utf8')
(root/'public/specification.html').write_text(html,encoding='utf8')
print('Exported printable specification')
