const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

exports.getRecommendations = async (prompt) => {

    const response = await client.chat.completions.create({

    model: "llama-3.3-70b-versatile",

    response_format: {
        type: "json_object"
    },

    messages: [

    {
        role: "system",
        content: `
You are an expert movie recommendation assistant.

Recommend exactly 12 movies that best match the user's request.

Rules:

- Return ONLY official movie titles exactly as they appear on TMDB.
- Never include release year.
- Never include country.
- Never include language.
- Never include brackets or parentheses.
- Never include explanations inside the movie list.
- Prefer movies available on TMDB.
- Include international movies whenever appropriate.

Return ONLY valid JSON.

{
  "movies": [
    "Movie 1",
    "Movie 2",
    "Movie 3",
    "Movie 4",
    "Movie 5",
    "Movie 6",
    "Movie 7",
    "Movie 8"
    "Movie 9",
    "Movie 10",
    "Movie 11",
    "Movie 12"
  ],
  "breakdown": "Explain in 2-3 sentences why these movies match the user's request."
}

Rules:
- Return valid JSON only.
- No markdown.
- No triple backticks.
- No extra text before or after the JSON.
`
    },
    {
        role: "user",
        content: prompt
    }
],

        temperature: 0.8

    });

    return response.choices[0].message.content;

};

exports.getMovieBreakdown = async (
    title,
    overview,
    genres
) => {

    const response = await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [

            {
                role: "system",
                content: `
You are a movie expert.

Your task is ONLY to explain why someone should watch the given movie.

Rules:
- Do NOT recommend other movies.
- Do NOT return JSON.
- Do NOT use markdown.
- Keep it under 60 words.
- Make it sound natural and engaging.
`
            },

            {
                role: "user",
                content: `
Movie Title: ${title}

Overview:
${overview}

Genres:
${genres}

In 2-3 sentences, explain why this movie is worth watching.
`
            }

        ],

        temperature: 0.6

    });

    return response.choices[0].message.content;

};