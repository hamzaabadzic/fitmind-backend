export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Only POST allowed" });
        }

        let rawBody = "";

        await new Promise((resolve) => {
            req.on("data", (chunk) => {
                rawBody += chunk;
            });
            req.on("end", resolve);
        });

        const { message } = JSON.parse(rawBody);

        if (!message) {
            return res.status(400).json({ error: "Missing message field" });
        }

        const SYSTEM_PROMPT = `
Ti si FitMind AI – napredni trener za ishranu, oporavak, trening i zdravlje.
Odgovaraj stručno, motivirajuće i jasno.
`;

        const openaiRes = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                input: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: message }
                ],
            }),
        });

        const data = await openaiRes.json();

        const reply =
            data?.output?.[0]?.content?.[0]?.text ||
            "Greška u AI odgovoru.";

        return res.status(200).json({ reply });

    } catch (err) {
        return res.status(500).json({
            error: "Server error",
            details: err.message,
        });
    }
}
