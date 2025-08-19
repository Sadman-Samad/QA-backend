const cohere = require('cohere-ai');

cohere.init(process.env.COHERE_API_KEY);



async function getEmbeddings(text, type = 'search_document') {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error("Invalid text input");
    }

    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3.0',
      input_type: type
    });

    
    if (!response.body.embeddings || !response.body.embeddings[0]) {
      throw new Error("No embeddings returned");
    }

    const embedding = response.body.embeddings[0];
    
    if (!Array.isArray(embedding) || embedding.length !== 1024) {
      throw new Error(`Invalid embedding format. Expected length 1024, got ${embedding.length}`);
    }

    return embedding;
  } catch (error) {
    console.error(`Embedding generation failed for text: "${text.substring(0, 50)}..."`, error.message);
    throw error;
  }
}


function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error("Inputs must be arrays");
  }
  
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch (${a.length} vs ${b.length})`);
  }

  if (a.length === 0 || b.length === 0) {
    throw new Error("Empty vectors provided");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    if (typeof a[i] !== 'number' || typeof b[i] !== 'number') {
      throw new Error("Vector elements must be numbers");
    }
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  

  if (isNaN(similarity)) {
    throw new Error("Invalid similarity calculation (NaN result)");
  }

  return similarity;
}

async function queryDocument(chunks, question) {
  try {
    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("Invalid chunks array");
    }
    if (!question || typeof question !== 'string') {
      throw new Error("Invalid question");
    }

   
    const questionEmbedding = await getEmbeddings(question, 'search_query');
    
    let bestChunk = "";
    let bestScore = -Infinity;
    let processedChunks = 0;

    
    for (const chunk of chunks) {
      try {
        processedChunks++;
        
        
        const chunkEmbedding = await getEmbeddings(chunk);
        const score = cosineSimilarity(chunkEmbedding, questionEmbedding);
        
        
        
        if (score > bestScore) {
          bestScore = score;
          bestChunk = chunk;
         
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${processedChunks}:`, chunkError.message);
        continue;
      }
    }

    if (!bestChunk) {
      throw new Error("No valid chunks could be processed");
    }

   
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `Context:\n${bestChunk}\n\nQuestion: ${question}\n\nAnswer the question using only the context. If the answer isn't in the context, say "I don't know".`,
      max_tokens: 200,
      temperature: 0.3,
    });

    const answer = response.body.generations[0].text.trim();
    
    
    return answer;
  } catch (error) {
    console.error("Query document failed:", error.message);
    throw new Error(`Failed to query document: ${error.message}`);
  }
}

module.exports = { 
  
  queryDocument,
  getEmbeddings,
  cosineSimilarity
};