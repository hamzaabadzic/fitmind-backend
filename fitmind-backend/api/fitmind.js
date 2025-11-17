export default async function handler(req, res) {
    const { message } = JSON.parse(req.body);

    const SYSTEM_PROMPT = `
Ti si FitMind AI – napredni trener za ishranu, trening, zdravlje, oporavak i mindset.
Odgovaraj stručno, motivirajuće i jasno.
Koristi ove sekcije:
1) Ishrana
2) Trening
3) Oporavak
4) Mindset
5) Kviz (ako korisnik želi)
`;

    const finalInput =
        SYSTEM_PROMPT +
        "\n\nKorisnik kaže: " +
        message +
        "\n\nOdgovori kao FitMind AI:";

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            input: finalInput
        })
    });

    const data = await openaiRes.json();

    res.status(200).json({
        reply: data.output_text
    });
}
