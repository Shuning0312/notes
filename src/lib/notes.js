// src/lib/notes.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

// Function to recursively get nested file/directory structure
function getNestedStructure(dir) {
    const structure = [];
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        items.forEach(item => {
            const fullPath = path.join(dir, item.name);
            const relativePath = path.relative(contentDirectory, fullPath);
            const normalizedRelativePath = relativePath.replace(/\\/g, '/'); 
            const slug = normalizedRelativePath.replace(/\.(md|mdx)$/, '');
            let order = Infinity;
            let title = '';
            let isClickable = false; // Default for directories

            if (item.isDirectory()) {
                const indexFilePathMd = path.join(fullPath, 'index.md');
                const indexFilePathMdx = path.join(fullPath, 'index.mdx');
                let indexFileContent = '';
                let indexData = {};

                if (fs.existsSync(indexFilePathMd) || fs.existsSync(indexFilePathMdx)) {
                    isClickable = true; // Directory is clickable if it has an index file
                    if (fs.existsSync(indexFilePathMd)) {
                        indexFileContent = fs.readFileSync(indexFilePathMd, 'utf8');
                    } else {
                        indexFileContent = fs.readFileSync(indexFilePathMdx, 'utf8');
                    }
                }

                if (indexFileContent) {
                    try { ({ data: indexData } = matter(indexFileContent)); } catch (e) {
                        console.error(`Error parsing frontmatter for index file: ${fullPath}`, e);
                    }
                }
                order = typeof indexData.order === 'number' ? indexData.order : Infinity;
                title = indexData.title || item.name;

                structure.push({
                    type: 'directory',
                    name: item.name,
                    title: title,
                    path: normalizedRelativePath,
                    slug: slug,
                    order: order,
                    isClickable: isClickable, // Add clickable flag
                    children: getNestedStructure(fullPath)
                });
            } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
                if (item.name === 'index.md' || item.name === 'index.mdx') {
                    return;
                }
                let fileContents = '';
                let data = {};
                try {
                    fileContents = fs.readFileSync(fullPath, 'utf8');
                    ({ data } = matter(fileContents));
                } catch (e) {
                    console.error(`Error reading or parsing frontmatter for file: ${fullPath}`, e);
                    return;
                }
                order = typeof data.order === 'number' ? data.order : Infinity;
                title = data.title || path.basename(item.name, path.extname(item.name));
                
                if (slug && slug.trim() !== '') {
                    structure.push({
                        type: 'file',
                        name: item.name,
                        title: title,
                        path: normalizedRelativePath,
                        slug: slug,
                        order: order,
                        isClickable: true, // Files are always clickable
                        children: []
                    });
                } else {
                    console.warn(`Generated empty or invalid slug for file: ${fullPath}`);
                }
            }
        });

        structure.sort((a, b) => {
            const orderA = a.order ?? Infinity;
            const orderB = b.order ?? Infinity;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });

    } catch (error) {
        console.error(`Error reading directory: ${dir}`, error);
    }
    return structure;
}

export function getNotesStructure() {
    if (!fs.existsSync(contentDirectory)) {
        console.warn(`Content directory not found: ${contentDirectory}`);
        return [];
    }
    return getNestedStructure(contentDirectory);
}

export function getNoteData(decodedSlugString) {
    if (!decodedSlugString || typeof decodedSlugString !== 'string' || decodedSlugString.trim() === '') {
        console.error(`[getNoteData] Invalid decodedSlugString received: ${decodedSlugString}`);
        return null;
    }
    console.log(`[getNoteData] Attempting to find note for decodedSlugString: '${decodedSlugString}'`);

    const potentialFilePaths = [
        path.join(contentDirectory, `${decodedSlugString}.md`),
        path.join(contentDirectory, `${decodedSlugString}.mdx`)
    ];
    const potentialIndexPaths = [
        path.join(contentDirectory, decodedSlugString, 'index.md'),
        path.join(contentDirectory, decodedSlugString, 'index.mdx')
    ];
    const allPotentialPaths = [...potentialFilePaths, ...potentialIndexPaths];
    let foundPath = '';
    for (const p of allPotentialPaths) {
        if (fs.existsSync(p)) {
            foundPath = p;
            console.log(`[getNoteData] Found note at path: ${foundPath}`);
            break;
        }
    }

    if (!foundPath) {
        console.error(`[getNoteData] Note file not found for decodedSlugString: '${decodedSlugString}'. Checked paths: ${allPotentialPaths.join(', ')}`);
        return null;
    }

    try {
        const fileContents = fs.readFileSync(foundPath, 'utf8');
        const { data, content } = matter(fileContents);
        let title = data.title;
        if (!title) {
            const isIndex = foundPath.endsWith('index.md') || foundPath.endsWith('index.mdx');
            if (isIndex) {
                title = path.basename(path.dirname(foundPath));
            } else {
                title = path.basename(foundPath, path.extname(foundPath));
            }
        }
        return {
            slug: decodedSlugString,
            title,
            content,
            data,
        };
    } catch (error) {
        console.error(`Error reading note file for decodedSlugString: '${decodedSlugString}' at path ${foundPath}`, error);
        return null;
    }
}

export function getAllNoteSlugs() {
    const structure = getNotesStructure();
    const slugs = new Set();

    function traverse(items) {
        items.forEach(item => {
            if (item.type === 'file' && item.slug && item.slug.trim() !== '' && item.isClickable) {
                slugs.add(item.slug);
            }
            if (item.type === 'directory' && item.slug && item.slug.trim() !== '' && item.isClickable) {
                slugs.add(item.slug);
            }
            if (item.children && item.children.length > 0) {
                traverse(item.children);
            }
        });
    }

    traverse(structure);
    const validSlugs = Array.from(slugs).filter(slug => slug && slug.trim() !== '');
    console.log('[getAllNoteSlugs] Filesystem-like slugs for getStaticPaths:', validSlugs);

    return validSlugs.map(fsSlug => ({
        params: {
            slug: fsSlug.split('/').map(part => encodeURIComponent(part)).filter(Boolean)
        }
    }));
}

