// src/app/notes/[...slug]/page.tsx
import { getNoteData, getAllNoteSlugs } from "@/lib/notes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

interface NotePageParams {
    slug: string[]; // [...slug] is an array of URL-encoded path segments
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    const paths = getAllNoteSlugs(); // This now returns URL-encoded slug parts
    console.log("[Page - generateStaticParams] Generated paths for static generation:", JSON.stringify(paths, null, 2));
    return paths.map(p => ({ slug: p.params.slug }));
}

async function getNote(params: NotePageParams) {
    // Each part in params.slug is already URL-encoded by Next.js routing if it came from a link
    // or by getAllNoteSlugs if it's for static generation.
    // We need to decode each part before joining to match the filesystem path.
    const decodedSlugParts = params.slug.map(part => decodeURIComponent(part));
    const slugStringForLookup = decodedSlugParts.join("/");
    
    console.log(`[Page - getNote] Original slug from params: ${params.slug.join("/")}`);
    console.log(`[Page - getNote] Decoded slug string for lookup: ${slugStringForLookup}`);
    
    const noteData = getNoteData(slugStringForLookup); // getNoteData expects a decoded, filesystem-like path string

    if (!noteData) {
        console.error(`[Page - getNote] Note not found for decoded slug: ${slugStringForLookup}. Triggering 404.`);
        notFound();
    }
    console.log(`[Page - getNote] Successfully fetched note: ${noteData.title}`);
    return noteData;
}

export default async function NotePage({ params }: { params: NotePageParams }) {
    console.log(`[Page - NotePage] Rendering page for params:`, JSON.stringify(params, null, 2));
    const note = await getNote(params);

    return (
        <article className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content}
            </ReactMarkdown>
        </article>
    );
}

