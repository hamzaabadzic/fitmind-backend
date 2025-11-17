export default async function handler(req, res) {
    try {
        const { message } = JSON.parse(req.body);

        const SYSTEM_PROMPT = `
Ti si FitMind AI – napredni trener za ishranu, trening, zdravlje i oporavak.
Odgovaraj stručno, detaljno i motivirajuće.
`;

        const openaiRes = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                input: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await openaiRes.json();

        // Extract text from OpenAI response
        const reply =
            data?.output?.[0]?.content?.[0]?.text ||
            "Greška u AI odgovoru.";

        res.status(200).json({ reply });

    } catch (err) {
        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
}
