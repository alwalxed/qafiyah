import * as dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { TwitterApi } from "twitter-api-v2";

const MAX_RETRY_ATTEMPTS = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_TWEET_LENGTH = 280;

const validateEnvironmentVariable = (
  name: string,
  value: string | undefined
): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const initializeTwitterClient = (): TwitterApi => {
  const {
    TWITTER_APP_KEY,
    TWITTER_APP_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
  } = process.env;

  return new TwitterApi({
    appKey: validateEnvironmentVariable("TWITTER_APP_KEY", TWITTER_APP_KEY),
    appSecret: validateEnvironmentVariable(
      "TWITTER_APP_SECRET",
      TWITTER_APP_SECRET
    ),
    accessToken: validateEnvironmentVariable(
      "TWITTER_ACCESS_TOKEN",
      TWITTER_ACCESS_TOKEN
    ),
    accessSecret: validateEnvironmentVariable(
      "TWITTER_ACCESS_SECRET",
      TWITTER_ACCESS_SECRET
    ),
  });
};

const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  options = {
    maxAttempts: MAX_RETRY_ATTEMPTS,
    initialDelayMs: INITIAL_RETRY_DELAY_MS,
  }
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const message = lastError.message.toLowerCase();

      if (message.includes("429") || message.includes("too many requests")) {
        console.error(`🛑 ${operationName} rate limited on attempt ${attempt}`);
        throw new Error("Rate limit hit. Aborting.");
      }

      if (attempt < options.maxAttempts) {
        const delay = options.initialDelayMs * Math.pow(2, attempt - 1);
        console.warn(
          `⚠️ ${operationName} failed (attempt ${attempt}): ${lastError.message}. Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `${operationName} failed after ${options.maxAttempts} attempts: ${lastError?.message}`
  );
};

const fetchFormattedPoem = async (): Promise<string> => {
  return executeWithRetry(async () => {
    const res = await fetch("https://api.qafiyah.com/poems/random");
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const text = await res.text();
    if (!text || text.trim().length === 0) {
      throw new Error("Empty poem returned from API");
    }
    if (text.length > MAX_TWEET_LENGTH) {
      throw new Error(
        `Poem too long for Twitter (${text.length}/${MAX_TWEET_LENGTH})`
      );
    }
    return text.trim();
  }, "Fetch formatted poem");
};

// Post to Twitter
const postTweet = async (
  twitterClient: TwitterApi,
  content: string
): Promise<string> => {
  return executeWithRetry(async () => {
    const response = await twitterClient.v2.tweet(content);
    if (!response?.data?.id) {
      throw new Error("Invalid response from Twitter API");
    }
    return response.data.id;
  }, "Post tweet");
};

// Main function
const run = async (): Promise<void> => {
  try {
    const twitterClient = initializeTwitterClient();
    const poem = await fetchFormattedPoem();
    console.log(`✓ Poem ready to post (${poem.length} chars):\n${poem}`);

    const tweetId = await postTweet(twitterClient, poem);
    console.log(`✅ Successfully tweeted! Tweet ID: ${tweetId}`);
    process.exit(0);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to post poem: ${message}`);
    process.exit(1);
  }
};

run();
