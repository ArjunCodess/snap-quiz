import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  model: string = "gemini-pro",
  temperature: number = 0.7,
  num_tries: number = 3,
  verbose: boolean = true
): Promise<OutputFormat[]> {
  const geminiModel: GenerativeModel = genAI.getGenerativeModel({ model: model });
  const list_input: boolean = Array.isArray(user_prompt);
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    try {
      const formatInstructions = `
        RESPONSE FORMAT REQUIREMENTS:
        1. Respond ONLY with a valid JSON array containing ${list_input ? 'multiple objects' : 'a single object'}
        2. Each object must exactly follow this structure: ${JSON.stringify(output_format)}
        3. Format Rules:
           - Use proper JSON syntax with double quotes for keys and string values
           - No trailing commas
           - No comments or additional text outside the JSON
           - All text responses must be under 15 words
           - Ensure each key exactly matches the specified format
        4. Example format:
           [
             {
               "question": "Your question here?",
               "answer": "The correct answer here",
               ${output_format.hasOwnProperty('option1') ? `
               "option1": "First incorrect option",
               "option2": "Second incorrect option",
               "option3": "Third incorrect option"
               ` : ''}
             }
           ]
        5. Do not include any explanations or text outside the JSON structure
      `;

      const prompt = `${system_prompt}\n${formatInstructions}\n${error_msg}\nTopic: ${user_prompt.toString()}`;
      
      if (verbose) {
        console.log("Sending prompt to Gemini:", prompt);
      }

      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 1000,
        },
      });

      const response = await result.response;
      let res: string = response.text();
      
      // Extract JSON from response
      const jsonMatch = res.match(/\[[\s\S]*\]/) || res.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        res = jsonMatch[0];
      }

      if (verbose) {
        console.log("Raw Gemini response:", res);
      }

      let output = JSON.parse(res);
      if (!Array.isArray(output)) {
        output = [output];
      }

      // Validate output
      if (output.length === 0) {
        throw new Error("Empty response received");
      }

      // Validate each object has all required fields
      output.forEach((item: OutputFormat, index: number) => {
        for (const key in output_format) {
          if (!item[key]) {
            throw new Error(`Missing required field "${key}" in item ${index + 1}`);
          }
        }
      });

      return output;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      error_msg = `\n\nError in previous attempt: ${errorMessage}. Please try again and ensure the response is valid JSON.`;
      console.error(`Attempt ${i + 1} failed:`, e);
      
      if (i === num_tries - 1) {
        console.error("All attempts failed");
        throw e;
      }
    }
  }

  return [];
}