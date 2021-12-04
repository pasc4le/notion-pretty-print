import { useRouter } from "next/dist/client/router"
import { getFormattedId } from "lib/notion";
import Custom404 from 'pages/404'

export default function NotionRedirect() {
    const r = useRouter();
    const { url } = r.query;

    if (url)
        if (url.length < 4)
            return <Custom404 />;
    else {
        let purl = url[3].split('-')
        let code = purl[purl.length -1]
        let pcode = getFormattedId(code)
        console.log(pcode)
        r.push({
            pathname: '/note/[id]',
            query: {
                id: pcode
            }
        })
    }

    return <Custom404 />
}