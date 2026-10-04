import { useState } from 'react';
import { Download, FileJson, FileText, Printer, X } from 'lucide-react';
import jsPDF from 'jspdf';

export default function DownloadModal({ open, onClose, decision, analysis }) {
  const [format, setFormat] = useState('md');
  if (!open || !analysis) return null;
  const md = `# MindXray — Reasoning X-Ray\n\n## Decision\n${decision?.decision || ''}\n\n## Summary\n${analysis.summary}\n\n## Assumptions\n${analysis.assumptions.map((x) => `- ${x.title}: ${x.description}`).join('\n')}\n\n## Blind Spots\n${analysis.blind_spots.map((x) => `- ${x.title}: ${x.description}`).join('\n')}\n\n## Conflicts\n${analysis.conflicts.map((x) => `- ${x.title}: ${x.description}`).join('\n')}\n\n## Critical Questions\n${analysis.critical_questions.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\n> MindXray does not decide for you.`;
  const downloadText = (name, text, type) => { const a=document.createElement('a'); const url=URL.createObjectURL(new Blob([text],{type})); a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);onClose(); };
  const downloadPdf = () => { const doc=new jsPDF({unit:'pt',format:'a4'}); const lines=doc.splitTextToSize(md,510); let y=54; lines.forEach(line=>{if(y>770){doc.addPage();y=54;}doc.text(line,42,y);y+=14;});doc.save('mindxray-report.pdf');onClose(); };
  return <div className="modal-backdrop" onMouseDown={(e)=>e.currentTarget===e.target&&onClose()}>
    <div className="download-modal" role="dialog" aria-modal="true" aria-labelledby="download-title">
      <button className="modal-close" onClick={onClose} aria-label="Close"><X/></button>
      <div className="modal-icon"><Download/></div><span className="eyebrow">EXPORT</span><h2 id="download-title">Download Report</h2><p>Choose a format for your reasoning record.</p>
      <div className="format-grid">
        <button className={`format-card ${format==='md'?'selected':''}`} onClick={()=>setFormat('md')}><FileText/><strong>Markdown</strong><span>Clean report for notes</span></button>
        <button className={`format-card ${format==='pdf'?'selected':''}`} onClick={()=>setFormat('pdf')}><Printer/><strong>PDF</strong><span>Print-friendly report</span></button>
        <button className={`format-card ${format==='json'?'selected':''}`} onClick={()=>setFormat('json')}><FileJson/><strong>JSON</strong><span>Structured analysis data</span></button>
      </div>
      <div className="modal-actions"><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn gold" onClick={()=>format==='pdf'?downloadPdf():format==='json'?downloadText('mindxray-analysis.json',JSON.stringify({decision,analysis},null,2),'application/json'):downloadText('mindxray-report.md',md,'text/markdown')}><Download size={17}/> Download</button></div>
    </div>
  </div>;
}
