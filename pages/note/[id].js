import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { getDatabase, getPage, getBlocks, Text, Cover, renderBlock } from 'lib/notion';
import { databaseId } from 'pages';

export function RenderedBlocks({blocks}) {
	const [renderedBlocks, setRenderedBlocks] = useState(undefined);
	useEffect(async () => {
		const r = blocks.map(async (v) => await renderBlock(v));
		setRenderedBlocks(r);

		return {
			renderedBlocks
		};
	})

	return renderedBlocks ? renderedBlocks : null
}

export default function Post({ page, blocks }) {
	if (!page || !blocks) {
		return null;
	}

	return (
		<div className="note_wrapper">
			<Head>
				<title>{page.properties.Name.title[0].plain_text} - Notion Pretty Print</title>
			</Head>

			<article className="note_container">
				<Cover cover={page.cover} alt={page.properties.Name.title[0].plain_text} />
				<h1 className="name">
					<Text text={page.properties.Name.title} icon={page.icon} />
				</h1>
				<section>
					{blocks.map((block) => (
						<Fragment key={block.id}>
							{renderBlock(block)}
						</Fragment>
					))}
				</section>
			</article>
		</div>
	);
}

export const getStaticPaths = async () => {
	const database = await getDatabase(databaseId);
	return {
		paths: database.map((page) => ({ params: { id: page.id } })),
		fallback: true,
	};
};

export const getStaticProps = async (context) => {
	const { id } = context.params;

	if(id == "[id]") return {
		notFound: true
	}
	
	let page;

	try {
		page = await getPage(id);
	} catch (error) {
		return {
			notFound: true
		}
	}

	const blocks = await getBlocks(id);

	const childBlocks = await Promise.all(
		blocks
			.filter((block) => block.has_children)
			.map(async (block) => {
				return {
					id: block.id,
					children: await getBlocks(block.id),
				};
			})
	);

	const blocksWithChildren = blocks.map((block) => {
		if (block.has_children && !block[block.type].children) {
			block[block.type]["children"] = childBlocks.find(
				(x) => x.id === block.id
			)?.children;
		}
		return block;
	});

	return {
		props: {
			page,
			blocks: blocksWithChildren,
		},
		revalidate: 1,
	};
};
