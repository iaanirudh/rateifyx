"use client";

import { useState, useCallback } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";

interface UploadedFile { name: string; size: number; status: "pending" | "processing" | "done" | "error"; quotes?: number; }

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const addFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming).map(f => ({
      name: f.name, size: f.size, status: "pending" as const
    }));
    setFiles(prev => [...prev, ...arr]);
    setDone(false);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, []);

  const processFiles = async () => {
    if (!files.length) return;
    setUploading(true);

    const fileInputEl = document.getElementById("file-upload") as HTMLInputElement;
    const formData = new FormData();

    // Simulate processing each file
    for (let i = 0; i < files.length; i++) {
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "processing" } : f));
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "done", quotes: Math.floor(Math.random() * 3) + 1 } : f));
    }

    setUploading(false);
    setDone(true);
  };

  const fmt = (bytes: number) => bytes < 1024 ? `${bytes}B` : bytes < 1048576 ? `${(bytes/1024).toFixed(1)}KB` : `${(bytes/1048576).toFixed(1)}MB`;

  const FORMATS = ["PDF", "Excel (.xlsx)", "Email (.eml)", "Text (.txt)"];

  return (
    <div style={{ padding: "32px 36px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--rx-text-2)", textTransform: "uppercase", marginBottom: 6 }}>Upload</div>
        <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#ede8dc", letterSpacing: "-0.02em" }}>
          File Upload
        </h1>
        <p style={{ fontSize: 12, color: "var(--rx-text-2)", marginTop: 6 }}>Upload quote files in any format. We'll extract and normalize everything automatically.</p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => document.getElementById("file-upload")?.click()}
        style={{
          border: `2px dashed ${dragging ? "#f59e0b" : "#1c1c1c"}`,
          padding: "52px 40px",
          textAlign: "center",
          background: dragging ? "rgba(245,158,11,0.04)" : "#0a0a0a",
          cursor: "pointer",
          transition: "all 0.2s",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(245,158,11,0.015) 12px, rgba(245,158,11,0.015) 24px)", pointerEvents: "none" }} />
        <Upload size={32} style={{ color: "#f59e0b", margin: "0 auto 16px" }} />
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#ede8dc", marginBottom: 8 }}>
          Drop files here or click to browse
        </div>
        <div style={{ fontSize: 12, color: "var(--rx-text-2)", marginBottom: 20 }}>Up to 20 files per batch</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {FORMATS.map(f => (
            <span key={f} style={{ fontSize: 10, border: "1px solid #1c1c1c", padding: "3px 10px", color: "var(--rx-text-2)", letterSpacing: "0.06em" }}>{f}</span>
          ))}
        </div>
        <input id="file-upload" type="file" multiple accept=".pdf,.xlsx,.xls,.txt,.eml" style={{ display: "none" }}
          onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>{files.length} file{files.length > 1 ? "s" : ""} queued</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#0a0a0a", border: `1px solid ${f.status === "done" ? "rgba(34,197,94,0.2)" : f.status === "error" ? "rgba(239,68,68,0.2)" : "#1c1c1c"}` }}>
                <FileText size={14} style={{ color: "var(--rx-text-2)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#ede8dc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: "var(--rx-text-2)", marginTop: 2 }}>{fmt(f.size)}</div>
                </div>
                <div style={{ fontSize: 11, flexShrink: 0 }}>
                  {f.status === "pending"    && <span style={{ color: "var(--rx-text-2)" }}>Pending</span>}
                  {f.status === "processing" && <span style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Processing</span>}
                  {f.status === "done"       && <span style={{ color: "#22c55e", display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={12} /> {f.quotes} quote{f.quotes !== 1 ? "s" : ""} extracted</span>}
                  {f.status === "error"      && <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={12} /> Error</span>}
                </div>
                {f.status === "pending" && (
                  <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rx-text-2)", padding: 2 }}>
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && !done && (
        <button
          onClick={processFiles}
          disabled={uploading}
          className="rx-btn"
          style={{ fontSize: 12, opacity: uploading ? 0.7 : 1, cursor: uploading ? "not-allowed" : "pointer" }}
        >
          {uploading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Processing...</> : `Process ${files.length} file${files.length > 1 ? "s" : ""}`}
        </button>
      )}

      {done && (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { setFiles([]); setDone(false); }} className="rx-btn" style={{ fontSize: 12 }}>
            Upload more files
          </button>
          <a href="/dashboard/quotes" className="rx-btn-ghost" style={{ fontSize: 12 }}>
            View quotes →
          </a>
        </div>
      )}

      {/* Email info */}
      <div style={{ marginTop: 40, padding: "24px", border: "1px solid #1c1c1c", background: "#0a0a0a" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--rx-text-2)", marginBottom: 12 }}>Magic email address</div>
        <p style={{ fontSize: 12, color: "var(--rx-text-2)", lineHeight: 1.8, marginBottom: 16 }}>
          Forward any carrier quote email directly to your RateifyX inbox. We'll extract and add it to your dashboard automatically.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#080808", border: "1px solid #1c1c1c" }}>
          <span style={{ fontSize: 13, color: "#f59e0b", fontWeight: 500, flex: 1 }}>quotes+YOUR_ID@inbound.rateifyx.com</span>
          <span style={{ fontSize: 10, color: "var(--rx-text-2)", border: "1px solid #1c1c1c", padding: "3px 10px", cursor: "pointer" }}>COPY</span>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
