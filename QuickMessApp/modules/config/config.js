process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "YOUR-API-KEY";

module.exports = {
    apiUrl: (process.env.NODE_ENV === "Development")? "http://172.19.0.11:5123/" : "http://localhost:5123/",
    openAIApiKey: process.env.OPENAI_API_KEY
}

