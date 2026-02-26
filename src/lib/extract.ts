// Server-side only: extracts text from PDF or DOCX buffer

export async function extractTextFromFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop();

  if (ext === "pdf") {
    return extractPDF(buffer);
  } else if (ext === "docx" || ext === "doc") {
    return extractDOCX(buffer);
  }
  throw new Error("Unsupported file format. Please upload PDF or DOCX.");
}

async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for server-side only
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    const text = data.text.trim();
    if (!text || text.length < 50) {
      throw new Error("Could not extract text from PDF. Please ensure it is not a scanned image.");
    }
    return text;
  } catch (err: any) {
    if (err.message?.includes("extract")) throw err;
    throw new Error("Failed to parse PDF file. Please try a different file.");
  }
}

async function extractDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    if (!text || text.length < 50) {
      throw new Error("Could not extract text from DOCX. File may be empty.");
    }
    return text;
  } catch (err: any) {
    if (err.message?.includes("extract")) throw err;
    throw new Error("Failed to parse DOCX file. Please try a different file.");
  }
}

export function validateFileSize(bytes: number): void {
  const maxMB = 5;
  if (bytes > maxMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxMB}MB limit.`);
  }
}

export function validateFileType(filename: string): void {
  const allowed = ["pdf", "docx", "doc"];
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (!allowed.includes(ext)) {
    throw new Error("Only PDF and DOCX files are supported.");
  }
}
