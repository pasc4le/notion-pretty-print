/*
 * SERVER SIDE
 * Shortcuts for the Server calls
 */

import { Client, APIResponseError } from "@notionhq/client";

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId) => {
	const response = await notion.databases.query({
		database_id: databaseId,
	});
	return response.results;
};

export const getPage = async (pageId) => {
	const response = await notion.pages.retrieve({ page_id: pageId });
	return response;
};

export const getBlocks = async (blockId) => {
	let r = undefined;
	try{
	r = await notion.blocks.children.list({
		block_id: blockId,
		page_size: 100,
	});
	} catch (APIResponseError) {
		// TODO: needs review. It may be a problem with the Notion API itself.
		console.log('debug: ' + blockId);
	}
	return r ? r.results : null;
};

export const search = async (query) => {
	const response = await notion.search({
		query,
		sort: {
			direction: 'ascending',
			timestamp: 'last_edited_time',
		}
	});
	return response;
};

/*
 * CLIENT SIDE
 * Notion block and text interpreter plus some client utils.
 */
import TeX from '@matejmazur/react-katex';
import { Fragment, useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monoBlue } from 'react-syntax-highlighter';


const API_HOST = process.env.API_HOST;
const FAVICON_API_URL = "https://www.google.com/s2/favicons?sz=64&domain_url="
const API_URL = '/api';

export const getColor = (c) => c;
export const getFavicon = (u) => FAVICON_API_URL + u;
export const getFormattedId = (id) => id.substr(0,8) + '-' + id.substr(8, 4) + '-' + id.substr(12, 4) + '-' + id.substr(16, 4) + '-' + id.substr(20, 12);

export const getClientSearch = (q) => {
	const searchUrl = API_URL + `/search?q=${q}`;
	return fetch(searchUrl).then((r) => r.json()).then(d => d);
};

export const Text = ({ text, icon }) => {
	if (!text) {
		return null;
	}

	return text.map((value, index) => {
		const {
			annotations
		} = value;


		switch (value.type) {
			case 'equation':
				const equation = value.equation
				return (
					<TeX key={index}>{equation.expression}</TeX>
				)
			case 'text':
				const text = value.text;
				return (
					<span
						className={Object.keys(annotations).map((v) => {
							if (v == "color") return annotations[v] == "default" ? null : annotations[v];
							return annotations[v] == true ? v : undefined;
						}).join(" ")}
						key={index}
					>
						{text.link
							? <a href={text.link.url}>{text.content}</a>
							: text.content
						}
					</span>
				)

			default:
				console.log(value);
				const content = value.plain_text;
				return (
					<span
						className={Object.keys(annotations).map((v) => {
							if (v == "color") return annotations[v] == "default" ? null : annotations[v];
							return annotations[v] == true ? v : undefined;
						}).join(" ")}
						key={index}
					>
						{content}
					</span>
				)
		}
	});
};

export const Cover = ({ cover, alt }) => {
	let url;
	if (!cover) return null;
	else
		if (cover.type == "external") url = cover.external.url;
		else if (cover.type == "file") url = cover.file.url;

	return (
		<img src={url} alt={alt} className="cover" />
	)
}

export const BookmarkComponent = ({ url, caption }) => {
	const [bookmarkMetadata, setBookmarkMetadata] = useState(undefined);

	return (
		<a href={url}>
			<div className="bookmark">
				<div className="bookmark-info">
					<div className="left">
						<img src={getFavicon(url)} className="favico" />
						<p>{url}</p>
					</div>
					<QRCode value={url} size={100} />
				</div>
				<p className="caption">
					<Text text={caption} />
				</p>
			</div>
		</a>
	)

}

export const renderBlock = (block) => {
	const { type, id } = block;
	const value = block[type];

	switch (type) {
		case "paragraph":
			return (
				<p>
					<Text text={value.text} />
				</p>
			);
		case "heading_1":
			return (
				<h1>
					<Text text={value.text} />
				</h1>
			);
		case "heading_2":
			return (
				<h2>
					<Text text={value.text} />
				</h2>
			);
		case "heading_3":
			return (
				<h3>
					<Text text={value.text} />
				</h3>
			);
		case "bulleted_list_item":
		case "numbered_list_item":
			return (
				<li>
					<Text text={value.text} />
				</li>
			);
		case "to_do":
			return (
				<div>
					<label htmlFor={id}>
						<input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
						<Text text={value.text} />
					</label>
				</div>
			);
		case "toggle":
			return (
				<details open>
					<summary>
						<Text text={value.text} />
					</summary>
					{value.children?.map((block) => (
						<Fragment key={block.id}>{renderBlock(block)}</Fragment>
					))}
				</details>
			);
		case "child_page":
			return <p>{value.title}</p>;
		case "image":
			const src =
				value.type === "external" ? value.external.url : value.file.url;
			const caption = value.caption.length > 0 ? value.caption[0].plain_text : "";
			return (
				<figure>
					<img src={src} alt={caption} className="image" />
					{caption && <figcaption>{caption}</figcaption>}
				</figure>
			);
		case "embed":
			const url = value.url;
			return (
				<div>
					<iframe src={url} className="embed" />
				</div>
			)
		case "equation":
			return (
				<TeX block>{value.expression}</TeX>
			)
		case "synced_block":
			console.log(block);
			return (
				<>
					{value.children ? value.children.map((v, i) => renderBlock(v)): null}
				</>
			)
		case "quote":
			return (
				<>
					<blockquote>
						<Text text={value.text} />
					</blockquote>
				</>
			)
		case "code":
			let code = "";
			value.text.map((v, i) =>
				code += v.plain_text
			);
			console.log(block);
			return (
				<SyntaxHighlighter
					language={value.language}
					style={monoBlue}
					customStyle={{
						borderRadius: '5px',
						margin: '5px 0 5px 0'
					}}
					wrapLongLines
				>
					{code}
				</SyntaxHighlighter>
			);
		case "bookmark":
			return (
				<BookmarkComponent url={value.url} caption={value.caption} />
			)
		case "divider":
			return (
				<hr />
			)
		case 'column_list':
			return (
				<div className="custom_list">
					{value.children.map((v) => {
						return renderBlock(v);
					})}
				</div>
			)
		default:
			console.log(block);
			return (
				<span className="error"> ❌ Unsupported block ({type === "unsupported" ? "unsupported by Notion API" : type}) </span>);
	}
};