import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://agmarknet.gov.in/PriceAndArrivals/CommodityDailyStateWise.aspx";

async function fetchAgmarknetData(stateCode, dateStr) {
  // 1️⃣ First request: get hidden form fields
  const initialRes = await axios.get(BASE_URL);
  const $ = cheerio.load(initialRes.data);

  const viewState = $("#__VIEWSTATE").val();
  const eventValidation = $("#__EVENTVALIDATION").val();
  const viewStateGenerator = $("#__VIEWSTATEGENERATOR").val();

  if (!viewState || !eventValidation) {
    throw new Error("Could not extract ASP.NET hidden fields");
  }

  // 2️⃣ Build form data
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", viewState);
  formData.append("__EVENTVALIDATION", eventValidation);
  if (viewStateGenerator) formData.append("__VIEWSTATEGENERATOR", viewStateGenerator);

  formData.append("ddlState", stateCode); // e.g., 32 = Kerala
  formData.append("txtDate", dateStr);   // format: DD-MMM-YYYY (21-Sep-2025)
  formData.append("btnSubmit", "Submit");

  // 3️⃣ POST request with form data
  const postRes = await axios.post(BASE_URL, formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0", // pretend to be browser
      Cookie: initialRes.headers["set-cookie"]?.join("; ") || "",
    },
  });

  // 4️⃣ Parse response HTML with Cheerio
  const $$ = cheerio.load(postRes.data);

  const rows = [];
  $$("#cphBody_GridPriceData tr").each((i, el) => {
    const cols = $$(el).find("td");
    if (cols.length >= 7) {
      rows.push({
        market: $$(cols[0]).text().trim(),
        arrivals: $$(cols[1]).text().trim(),
        unit: $$(cols[2]).text().trim(),
        variety: $$(cols[3]).text().trim(),
        minPrice: $$(cols[4]).text().trim(),
        maxPrice: $$(cols[5]).text().trim(),
        modalPrice: $$(cols[6]).text().trim(),
      });
    }
  });

  return rows;
}

// 🔍 Example usage
fetchAgmarknetData("32", "21-Sep-2025")
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch((err) => console.error(err));
