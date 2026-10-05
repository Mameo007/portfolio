import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** All projects, sorted by `order` then newest first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export const projectNumber = (index: number) => String(index + 1).padStart(2, '0');
