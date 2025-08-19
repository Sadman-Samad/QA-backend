const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

async function processDocument(fileBuffer, filename) {
  let text;
  
  if (filename.endsWith('.pdf')) {
    const data = await pdf(fileBuffer);
    text = data.text;
  } else if (filename.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    text = result.value;
  } else {
    text = fileBuffer.toString('utf-8');
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });

  const chunks = await splitter.splitText(text);
  
  return { text, chunks };
}

module.exports = { processDocument };