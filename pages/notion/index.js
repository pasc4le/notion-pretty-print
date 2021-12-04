import { getFormattedId } from "lib/notion";
import { useRouter } from "next/dist/client/router"
import { useState } from "react";

export default function NotionRedirector() {
    const r = useRouter();
    const [inputValue, setInputValue] = useState("");
    const redirectToPage = () => {
        const rawPreCode = inputValue.split('-')
        let rawCode = rawPreCode[rawPreCode.length -1]; 
        if(rawCode[rawCode.length -1 ] == '/') rawCode = rawCode.substr(0, rawCode.length-1);
        const id = getFormattedId(rawCode);
        r.push({
            pathname: '/note/[id]',
            query: {
                id
            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="font-mono text-4xl">Notion Redirector</h2>
            <input type="input"
                className="px-2 py-1 mt-1 border-2 border-gray-700 text-gray-400 w-[400px]"
                placeholder="Butta qui il tuo URL Notion"
                onChange={(t) => setInputValue(t.target.value)}
            />
            {inputValue && <button className="px-5 py-2 mt-2 text-gray-100 bg-gray-900" onClick={redirectToPage}>
                Redirect Me
            </button>}
        </div>
    )
}