import express, { Request, Response, NextFunction } from "express";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

const opts = {
    points: 10, // 6 points
    duration: 1, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

function rateLimiterMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const remoteAddress = req.ip;
        if (remoteAddress) {
            try {
                await rateLimiter.consume(remoteAddress, 1);
                next();
            } catch (rateLimiterRes: any) {
                const secs =
                    Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;

                res.status(429).json({
                    error: "Too Many Requests",
                    message: `Rate limit exceeded. Try again in ${secs} seconds.`,
                    retryAfter: secs,
                });
            }
        } else {
            res.status(500).json({
                error: "Internal Server Error",
                message: "Failed to gather Rate Limit Identifier",
            });
        }
        return;
    };
}

const app = express();

app.use(rateLimiterMiddleware());

const port = process.env.PORT || 3000;
const githubToken = process.env.ANIME_SCRAPE_GITHUB_TOKEN;

app.get("/", async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            message: "OK",
        });
    } catch (e) {
        res.status(500).json({
            message: `Internal Server Error!`,
            error: e,
        });
        return;
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
                    Authorization: `Bearer ${githubToken}`,
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
        return;
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: e,
        });
        return;
    }
});

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

export default app;
