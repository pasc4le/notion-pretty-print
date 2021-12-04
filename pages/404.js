import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Notion Pretty Print - 404</title>
            </Head>

            <div className="wrapper">
                <h1 className="message">404</h1>
                <p>Are you lost?</p>
                <Link href="/">
                    ← Go back to the homepage
                </Link>
            </div>
        </>
    )
}