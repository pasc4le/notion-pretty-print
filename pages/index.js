import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getClientSearch, Text } from 'lib/notion';

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home() {
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [typing, setTyping] = useState(false);
    const [queryResult, setQueryResult] = useState(undefined);

    const onQueryChange = (event) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTyping(true);

        setTypingTimeout(setTimeout(async () => {
            const r = await getClientSearch(event.target.value);
            setQueryResult(r.results);
            setTyping(false);
        }, 1000));
    }

    return (
        <>
            <Head>
                <title>Notion Pretty Print - Search</title>
            </Head>
            <div className="home_page_wrapper">
                <h1 className="brand">Notion Pretty Print</h1>
                <input type="input" placeholder="What do you want to search?" className="searchbox" onChange={onQueryChange} />
                {typing && <div className="lds-facebook"><div></div><div></div><div></div></div>}
                <div className="search_results_wrapper">
                    {queryResult
                        ? queryResult.map((v, i) => {
                            const { properties: { Name: { title } }, id, icon } = v;
                            let prefix = undefined
                            if(icon) prefix = icon.type == 'emoji' ? icon.emoji : undefined;
                            return (
                                <Link key={i} href={{
                                    pathname: 'note/[id]',
                                    query: {
                                        id
                                    }
                                }} passHref>
                                    <a className="search_result">
                                        {prefix} <Text text={title} />
                                    </a>
                                </Link>
                            )
                        })
                        : null}
                </div>
            </div>
        </>
    )
}