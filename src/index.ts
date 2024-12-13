import express from 'express'
import puppeteer from 'puppeteer-core'

const app = express()
const PORT = 3000

// Middleware for parsing JSON requests
app.use(express.json())

app.get('/', async (req: any, res: any) => {
  return res.status(200).send('The puppeteer ssr render for spa.')
})

// Puppeteer route for rendering pages
app.get('/render', async (req: any, res: any) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Please provide a URL to render.' })
  }

  let browser
  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      browser: 'chrome',
      channel: 'chrome'
    })
    const page = await browser.newPage()
    // const domain = 'https://www.pantone.com'

    // Navigate to the requested URL
    // Options for waitUntil:
    // 'load' - Waits for the load event (default).
    // 'domcontentloaded' - Waits for the DOM content to load.
    // 'networkidle0' - Waits until there are no network connections for 500 ms.
    // 'networkidle2' - Waits until there are fewer than 2 network connections for 500 ms.
    await page.goto(url as string, { timeout: 60000, waitUntil: 'networkidle0' })

    // Extract the rendered HTML
    const html = await page.content()
    // const updatedHtml = html.replace(/<link\s+[^>]*href="(\/[^"]+)"/g, (match, path) => {
    //   return match.replace(path, `${domain}${path}`)
    // })
    // const renderHtml = updatedHtml.replace(/<script\s+[^>]*src="(\/[^"]+)"/g, (match, path) => {
    //   return match.replace(path, `${domain}${path}`)
    // })

    res.status(200).send(html)
  } catch (error) {
    console.error('Error rendering page:', error)
    res.status(500).json({ error: 'Failed to render page.' })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
})

// Start the server
app.listen(PORT, () => {
  console.info(`Server is running at http://localhost:${PORT}`)
})
