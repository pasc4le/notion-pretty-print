# Notion Pretty-Print
This is a simple tool to pretty-print your Notion notes with custom styles. I've taken some code from [Samuel Kraft's Guide](https://samuelkraft.com/blog/building-a-notion-blog-with-public-api).
## Getting Started
1. Clone this repo to your machine: `git clone https://github.com/pasc4le/notion-pretty-print.git`
2. Go to [Your Notion Integrations](https://www.notion.so/my-integrations) and create a new integration. (This could be either an Internal or Public Integration)
3. Get the NOTION_DATABASE_ID you want to use for Notion Pretty Print. [Guide](https://stackoverflow.com/questions/67728038/where-to-find-database-id-for-my-database-in-notion)
4. Create a `.env` file that contains your Integration Token and the Database ID.
```env
NOTION_TOKEN=your_token
NOTION_DATABASE_ID=your_database_id
```
5. Build the nextjs webapp with `yarn build`
6. Start the webapp with `yarn start`
## Deploy on Vercel
This project is deployable on vercel.com. Use this button for an easy start:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpasc4le%2Fnotion-pretty-print.git&env=NOTION_TOKEN,NOTION_DATABASE_ID&envDescription=For%20this%20project%20to%20work%20you%20need%20to%20generate%20your%20own%20Notion%20Integration%20secret%20Token%20and%20you%20should%20get%20your%20database%20id.%20Checkout%20the%20README%20for%20more%20info.&envLink=https%3A%2F%2Fgithub.com%2Fpasc4le%2Fnotion-pretty-print)
## Blocks Support
Not all the Notion blocks are supported unfortunately, this is the complete support list:

| Block Name                  | Status |
| --------------------------- | ------ |
| Text                        | ✅      |
| Sub-Page                    | 🚧      |
| To-do list                  | ✅      |
| Headings                    | ✅      |
| Table                       | ❌      |
| Bullet list                 | ✅      |
| Numbered list               | 🚧      |
| Toggle                      | ✅      |
| Quote                       | ✅      |
| Link to Page                | ❌      |
| Mention Person              | 🚧      |
| Mention Date                | 🚧      |
| Mention Page                | 🚧      |
| Emojis                      | ✅      |
| Inline Equation             | ✅      |
| Inline Code                 | ✅      |
| Child Databases (All Types) | 🔧      |
| Image                       | ✅      |
| Bookmark                    | ✅      |
| Video                       | 🔧      |
| Block Code                  | ✅      |
| Table of Contents           | 🔧      |
| Breadcrumb                  | 🔧      |
| Any Embed                   | 🚧      |

Legend:
- ✅ Fully Supported
- 🚧 Partially Supported (Not Final)
- 🔧 Not yet implemented
- ❌ Not supported by Notion API 
## Development
You can run it in development mode via `yarn dev`. It is slow (really slow), because of the real-time "translation" of the Notion's blocks.
Pull requests are well accepted ☺️
