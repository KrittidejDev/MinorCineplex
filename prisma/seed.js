const { PrismaClient } = require("../src/generated/prisma");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const fs = require("fs");
require("dotenv").config();

puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();
const trailerCache = new Map();

// ฟังก์ชันค้นหา trailer ด้วย YouTube Data API
async function searchYouTubeTrailer(movieTitle) {
  if (trailerCache.has(movieTitle)) {
    console.log(`🔍 Using cached trailer for ${movieTitle}`);
    return trailerCache.get(movieTitle);
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ YouTube API key not found in .env");
      return null;
    }

    const channelId = "UCWX-AbDUDdbWij4H0E8Msuw"; // Major Group
    console.log(`🔍 Searching YouTube for trailer: ${movieTitle}`);

    const normalizedTitle = movieTitle
      .toLowerCase()
      .replace(/cifan/i, "")
      .replace(/part \d+/i, "")
      .replace(/[-:]/g, " ")
      .replace(/tee yod/i, "ธี่หยด")
      .trim();

    const searchQueries = [
      `${normalizedTitle} trailer`,
      `${normalizedTitle} ตัวอย่าง`,
      `${normalizedTitle} 3`,
      "ธี่หยด 3",
      "tee yod 3",
      `${normalizedTitle} official trailer`,
      "ธี่หยด 3 official trailer",
      "tee yod 3 official trailer",
      "ธี่หยด 3 ตัวอย่างภาพยนตร์",
      "tee yod 3 ตัวอย่างภาพยนตร์",
    ];

    for (const query of searchQueries) {
      console.log(`🔍 Trying query: ${query}`);
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${encodedQuery}&type=video&maxResults=1&key=${apiKey}`;

      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          timeout: 10000,
        });

        const video = response.data.items[0];
        if (video) {
          const trailerUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
          console.log(
            `✅ Found YouTube trailer for ${movieTitle}: ${trailerUrl}`
          );
          trailerCache.set(movieTitle, trailerUrl);
          return trailerUrl;
        }
      } catch (err) {
        console.warn(
          `⚠️ Failed to search with query "${query}": ${err.message}`
        );
        if (err.response?.status === 403) {
          console.error("❌ API key error or quota exceeded");
          return null;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.warn(
      `⚠️ No YouTube trailer found for ${movieTitle} after trying all queries`
    );
    trailerCache.set(movieTitle, null);
    return null;
  } catch (err) {
    console.warn(
      `⚠️ Failed to search YouTube for ${movieTitle}: ${err.message}`
    );
    trailerCache.set(movieTitle, null);
    return null;
  }
}

// ปรับปรุงการดึง movie meta
async function fetchMovieMeta(url, retries = 2) {
  let browser;
  let page;
  try {
    console.log(`🔍 Fetching movie meta: ${url}`);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ],
    });

    page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.resourceType() === "image") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const movieInfo = await page.evaluate(() => {
      const title = (() => {
        const metaTitle = document.querySelector('meta[property="og:title"]');
        const h1Title = document.querySelector("h1, .movie-title, .title");
        const titleTag = document.querySelector("title");

        return (
          metaTitle?.content ||
          h1Title?.textContent?.trim() ||
          titleTag?.textContent?.trim() ||
          "Unknown Title"
        );
      })();

      const description = (() => {
        const metaDesc = document.querySelector(
          'meta[property="og:description"]'
        );
        const descDiv = document.querySelector(
          ".movie-description, .synopsis, .plot, .description"
        );

        return (
          metaDesc?.content ||
          descDiv?.textContent?.trim() ||
          "No description available"
        );
      })();

      const posterUrl = (() => {
        const metaImage = document.querySelector('meta[property="og:image"]');
        const posterImg = document.querySelector(
          ".poster img, .movie-poster img, .movie-image img"
        );

        let url = metaImage?.content || posterImg?.src || null;
        if (url && url.startsWith("/")) {
          url = "https://www.majorcineplex.com" + url;
        }

        return url;
      })();

      const trailerUrl = (() => {
        const isVideoUrl = (url) => {
          if (!url) return false;
          return url.includes("youtube.com/watch") || url.includes("youtu.be");
        };
        const videoLinks = document.querySelectorAll(
          'a[href*="youtube.com/watch"], a[href*="youtu.be"]'
        );
        for (const link of videoLinks) {
          if (isVideoUrl(link.href)) {
            return link.href.includes("youtu.be")
              ? `https://www.youtube.com/watch?v=${link.href.split("/").pop()}`
              : link.href;
          }
        }
        return null;
      })();

      const genre = document
        .querySelector('.genre, .category, [class*="genre"], .movie-genre')
        ?.textContent?.trim();
      const rating = document
        .querySelector('.rating, .score, [class*="rating"], .movie-rating')
        ?.textContent?.trim();
      const duration = document
        .querySelector(
          '.duration, .runtime, [class*="duration"], .movie-duration'
        )
        ?.textContent?.trim();
      const releaseDate = document
        .querySelector(
          '.release-date, .premiere, [class*="release"], .movie-release'
        )
        ?.textContent?.trim();

      return {
        title: title.trim(),
        description: description.trim(),
        posterUrl,
        trailerUrl,
        genre,
        rating,
        duration,
        releaseDate,
      };
    });

    const trailerUrl =
      movieInfo.trailerUrl || (await searchYouTubeTrailer(movieInfo.title));

    await browser.close();

    const result = {
      ...movieInfo,
      trailerUrl,
      pageUrl: url,
    };

    console.log(
      `✅ Movie meta fetched: ${movieInfo.title}${trailerUrl ? " (with trailer)" : " (no trailer)"}`
    );
    return result;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch movie meta for ${url}: ${err.message}`);
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn(`⚠️ Failed to close browser: ${closeErr.message}`);
      }
    }

    try {
      if (page) {
        const html = await page.content();
        fs.writeFileSync(`debug-major-${url.split("/").pop()}.html`, html);
        console.log(
          `⚠️ Saved Major Cineplex HTML for debugging: debug-major-${url.split("/").pop()}.html`
        );
      }
    } catch (debugErr) {
      console.warn(`⚠️ Failed to save debug HTML: ${debugErr.message}`);
    }

    const urlParts = url.split("/");
    const slug = urlParts[urlParts.length - 1];
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    console.log(`⚠️ Using fallback data for ${fallbackTitle}`);
    return {
      title: fallbackTitle,
      description: "No description available",
      posterUrl: null,
      trailerUrl: null,
      pageUrl: url,
      genre: "Unknown",
      rating: null,
      duration: null,
      releaseDate: null,
    };
  }
}

// ปรับปรุงการโหลดสาขาและโรงหนัง
async function seedCinemas() {
  console.log("🏢 Loading cinemas...");

  let retries = 3;
  while (retries > 0) {
    try {
      const timestamp = Date.now();
      const cinemaRes = await axios.get(
        `https://www.majorcineplex.com/home/cinema_bar/all?_=${timestamp}`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "en-US,en;q=0.9,th-TH;q=0.8",
          },
          timeout: 15000, // เพิ่ม timeout เป็น 15 วินาที
        }
      );

      const $ = cheerio.load(cinemaRes.data);
      const cinemas = [];
      const branches = new Map();

      $(".bcbl-branches").each((i, el) => {
        const cinemaId = parseInt($(el).attr("data-cinema-id"));
        const title = $(el).attr("data-branch-title");
        const province = $(el).attr("data-province") || "Bangkok";

        if (cinemaId && title) {
          cinemas.push({
            id: cinemaId,
            name: title.trim(),
            province: province.trim(),
          });

          if (!branches.has(province)) {
            branches.set(province, []);
          }
          branches.get(province).push({ id: cinemaId, name: title.trim() });
        }
      });

      if (cinemas.length === 0) {
        console.warn("⚠️ No cinemas found in response");
        fs.writeFileSync(`debug-cinemas.html`, cinemaRes.data);
        console.log("⚠️ Saved cinema HTML for debugging: debug-cinemas.html");
        throw new Error("No cinemas found");
      }

      console.log(
        `📍 Found ${cinemas.length} cinemas in ${branches.size} provinces`
      );

      for (const [provinceName, cinemaList] of branches) {
        let branch = await prisma.branch.findFirst({
          where: { name: `Major Cineplex ${provinceName}` },
        });

        if (branch) {
          branch = await prisma.branch.update({
            where: { id: branch.id },
            data: { address: provinceName },
          });
        } else {
          branch = await prisma.branch.create({
            data: {
              name: `Major Cineplex ${provinceName}`,
              address: provinceName,
            },
          });
        }

        for (const cinema of cinemaList) {
          await prisma.cinema.upsert({
            where: { id: cinema.id },
            update: {
              name: cinema.name,
              branchId: branch.id,
            },
            create: {
              id: cinema.id,
              branchId: branch.id,
              name: cinema.name,
            },
          });
        }

        console.log(
          `✅ Branch created: ${provinceName} (${cinemaList.length} cinemas)`
        );
      }

      return cinemas;
    } catch (err) {
      retries--;
      console.warn(
        `⚠️ Failed to load cinemas (retry ${3 - retries}/${3}): ${err.message}`
      );
      if (retries === 0) {
        console.error("❌ All retries failed for cinemas");
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return [];
}

// ปรับปรุงการโหลดรายการหนัง
async function seedMovies() {
  console.log("🎬 Loading movies...");

  try {
    const res = await axios.get("https://www.majorcineplex.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(res.data);
    const movieUrls = new Set();

    const jsonMain = $("#json_main").html();
    if (jsonMain) {
      try {
        const jsonLD = JSON.parse(jsonMain);
        if (jsonLD.itemListElement) {
          for (const item of jsonLD.itemListElement) {
            if (item.url) movieUrls.add(item.url);
          }
        }
      } catch (e) {
        console.warn("⚠️ Failed to parse JSON-LD");
      }
    }

    $('a[href*="/movie/"]').each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/movie/")) {
        const fullUrl = href.startsWith("http")
          ? href
          : `https://www.majorcineplex.com${href}`;
        movieUrls.add(fullUrl);
      }
    });

    try {
      const movieListRes = await axios.get(
        "https://www.majorcineplex.com/movie",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );
      const $list = cheerio.load(movieListRes.data);

      $list('a[href*="/movie/"]').each((i, el) => {
        const href = $list(el).attr("href");
        if (href && href.includes("/movie/")) {
          const fullUrl = href.startsWith("http")
            ? href
            : `https://www.majorcineplex.com${href}`;
          movieUrls.add(fullUrl);
        }
      });
    } catch (e) {
      console.warn("⚠️ Failed to fetch movie listing page");
    }

    console.log(`🔗 Found ${movieUrls.size} movie URLs`);

    const movies = [];
    let processedCount = 0;

    for (const url of movieUrls) {
      let details;
      let retryCount = 0;
      while (retryCount <= 2) {
        try {
          details = await fetchMovieMeta(url, retryCount);
          if (details && details.title !== "Unknown Title") {
            break;
          }
        } catch (retryErr) {
          console.warn(
            `⚠️ Retry ${retryCount + 1} failed for ${url}: ${retryErr.message}`
          );
        }
        retryCount++;
        if (retryCount <= 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * retryCount)
          );
        }
      }

      if (!details) {
        console.warn(`⚠️ Skipping ${url} after all retries`);
        continue;
      }

      let durationMin = 120;
      if (details.duration) {
        const durationMatch = details.duration.match(/(\d+)/);
        if (durationMatch) {
          durationMin = parseInt(durationMatch[1]);
        }
      }

      try {
        const movieRecord = await prisma.movie.upsert({
          where: { title: details.title },
          update: {
            description: details.description,
            posterUrl: details.posterUrl,
            trailerUrl: details.trailerUrl,
            durationMin,
            genre: details.genre,
            rating: details.rating,
          },
          create: {
            title: details.title,
            durationMin,
            description: details.description,
            posterUrl: details.posterUrl,
            trailerUrl: details.trailerUrl,
            genre: details.genre || "Unknown",
            rating: details.rating,
          },
        });

        movies.push(movieRecord);
        processedCount++;

        console.log(
          `🎬 Movie ${processedCount}/${movieUrls.size}: ${details.title}${details.trailerUrl ? " ✅" : " ❌"}`
        );
      } catch (upsertErr) {
        console.warn(
          `⚠️ Failed to upsert movie ${details.title}: ${upsertErr.message}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(
      `✅ Processed ${movies.length} movies (${movies.filter((m) => m.trailerUrl).length} with trailers)`
    );
    return movies;
  } catch (err) {
    console.error("❌ Failed to load movies:", err.message);
    return [];
  }
}

// ปรับปรุงการโหลดรอบฉาย
async function seedShowtimes(cinemas, movies) {
  console.log("🎟️ Loading showtimes...");

  const today = new Date();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  let totalShowtimes = 0;

  for (const date of dates) {
    console.log(`📅 Processing date: ${date}`);

    for (const cinema of cinemas || []) {
      try {
        const res = await axios.post(
          "https://www.majorcineplex.com/booking2/get_showtime",
          qs.stringify({
            cinema_text: cinema.id,
            date_link: date,
            flag_special_cinema: "normal",
            flag_type_showtime: "one_cinema",
          }),
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            timeout: 10000,
          }
        );

        const data = res.data;
        if (!data || !data.movies) continue;

        let cinemaShowtimes = 0;

        for (const movieData of data.movies) {
          const movieRecord = movies.find((m) => {
            const titleMatch =
              m.title.toLowerCase().trim() ===
              movieData.title.toLowerCase().trim();
            const descMatch =
              m.description &&
              m.description
                .toLowerCase()
                .includes(movieData.title.toLowerCase());
            return titleMatch || descMatch;
          });

          if (!movieRecord) {
            console.log(`⚠️ Movie not found: ${movieData.title}`);
            continue;
          }

          if (movieData.showtimes && Array.isArray(movieData.showtimes)) {
            for (const show of movieData.showtimes) {
              if (!show.startTime) continue;

              try {
                const showDateTime = new Date(`${date}T${show.startTime}`);

                if (isNaN(showDateTime.getTime())) {
                  console.warn(
                    `⚠️ Invalid datetime: ${date}T${show.startTime}`
                  );
                  continue;
                }

                await prisma.showtime.create({
                  data: {
                    movieId: movieRecord.id,
                    cinemaId: cinema.id,
                    startTime: showDateTime,
                    price: show.price || 200,
                    availableSeats: show.availableSeats || 100,
                  },
                });

                cinemaShowtimes++;
                totalShowtimes++;
              } catch (showtimeErr) {
                console.warn(
                  `⚠️ Failed to create showtime: ${showtimeErr.message}`
                );
              }
            }
          }
        }

        if (cinemaShowtimes > 0) {
          console.log(`✅ ${cinema.name}: ${cinemaShowtimes} showtimes`);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.warn(
          `⚠️ Failed to fetch showtimes for ${cinema.name} on ${date}: ${err.message}`
        );
      }
    }
  }

  console.log(`✅ Total showtimes created: ${totalShowtimes}`);
}

async function main() {
  try {
    console.log("🚀 Starting Major Cineplex data seeding...");
    console.log("=".repeat(50));

    const startTime = Date.now();

    const cinemas = await seedCinemas();
    if (!cinemas || !Array.isArray(cinemas) || cinemas.length === 0) {
      console.warn("⚠️ No cinemas found, continuing with movies only");
    } else {
      console.log(`✅ Loaded ${cinemas.length} cinemas`);
    }

    const movies = await seedMovies();
    if (!movies || !Array.isArray(movies) || movies.length === 0) {
      console.warn("⚠️ No movies found, but continuing with cinemas");
    } else {
      console.log(`✅ Loaded ${movies.length} movies`);
    }

    await seedShowtimes(cinemas, movies);

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log("=".repeat(50));
    console.log("✅ Seed completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Cinemas: ${cinemas?.length || 0}`);
    console.log(`   - Movies: ${movies?.length || 0}`);
    console.log(
      `   - Movies with trailers: ${movies?.filter((m) => m.trailerUrl)?.length || 0}`
    );
    console.log(`   - Duration: ${duration}s`);
    console.log("=".repeat(50));
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

main();
