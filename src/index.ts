import express, { Request, Response } from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/version", async (_: Request, res: Response) => {
    const getRelease = await fetch(
        "https://api.github.com/repos/arifldhewo/anime-scrape/releases",
        {
            method: "GET",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.ANIME_SCRAPE_GITHUB_TOKEN}`,
                "X-Github-Api-Version": "2022-11-28",
                "User-Agent": "anime-scrape",
            },
        }
    );

    res.send(await getRelease.json());
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

export default app;
