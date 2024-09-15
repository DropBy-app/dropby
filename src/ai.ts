import { CohereClient } from "cohere-ai";

async function generateTitle(description: string): Promise<string> {
  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_API_KEY as string,
  });
  const result = await cohere.chat({
    model: "command-r",
    message:
      "Generate a title given a task description. Keep it simple and descriptive. \n Description: " +
      description,
  });
  return result.text;
}

interface TimeAndSizeEstimate {
  time: number;
  size: string;
}

async function estimateTimeAndSize(
  description: string
): Promise<TimeAndSizeEstimate> {
  const cohere = new CohereClient({
    token: import.meta.env.VITE_COHERE_API_KEY as string,
  });
  // example:
  //   response_format={
  //     "type": "json_object",
  //     "schema": {
  //       "type": "object",
  //       "required": ["title", "author", "publication_year"],
  //       "properties": {
  //         "title": { "type": "string" },
  //         "author": { "type": "string" },
  //         "publication_year": { "type": "integer" }
  //       }
  //     }
  //   }
  const output = await cohere.chat({
    model: "command-r",
    message:
      'Generate a JSON to estimate the time and size given the task description. For time, generate a number in minutes, with 0 being less than 1 minute. For size, choose between "small", "medium", "large". \n Description: ' +
      description,
    responseFormat: {
      type: "json_object",
      schema: {
        type: "object",
        required: ["time", "size"],
        properties: {
          time: { type: "integer" },
          size: { type: "string" },
        },
      },
    },
  });
  // deserialize the response
  const result: TimeAndSizeEstimate = JSON.parse(output.text);
  // validate the response
  if (!result.size || !result.time) {
    throw new Error("Invalid response from Cohere API");
  }
  return result;
}
