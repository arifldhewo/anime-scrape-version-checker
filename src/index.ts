import express, { Request, Response } from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/", async (_: Request, res: Response) => {
    try {
        res.status(200).json({
            message: "OK",
        });
    } catch (e) {
        res.status(500).json({
            message: `Internal Server Error!`,
            error: e,
        });
    }
});

app.get("/version", async (_: Request, res: Response) => {
    try {
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

        if (getRelease.status > 399) {
            res.status(getRelease.status).json({
                error: await getRelease.json(),
            });
        } else {
            res.status(200).send(await getRelease.json());
        }
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: e,
        });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

export default app;
