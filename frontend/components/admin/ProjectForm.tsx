"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/app/actions/projects";
import { uploadImage } from "@/app/actions/upload";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ProjectForm({ project }: { project?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImage || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      
      let imageUrl = coverImageUrl;
      
      if (file && file.size > 0) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        imageUrl = await uploadImage(uploadData);
        setCoverImageUrl(imageUrl);
      }

      const data = {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        category: formData.get("category") as string,
        year: formData.get("year") as string,
        content: formData.get("content") as string,
        coverImage: imageUrl,
        isFeatured: formData.get("isFeatured") === "on",
      };

      if (project?.id) {
        await updateProject(project.id, data);
      } else {
        await createProject(data);
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl bg-white p-8 rounded-sm border border-navy-100 shadow-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium text-navy-950">Title</label>
        <input type="text" id="title" name="title" defaultValue={project?.title} required className="border border-navy-100 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-bronze-500" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className="font-medium text-navy-950">Slug</label>
        <input type="text" id="slug" name="slug" defaultValue={project?.slug} required className="border border-navy-100 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-bronze-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="font-medium text-navy-950">Category</label>
          <input type="text" id="category" name="category" defaultValue={project?.category} required className="border border-navy-100 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-bronze-500" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="year" className="font-medium text-navy-950">Year</label>
          <input type="text" id="year" name="year" defaultValue={project?.year} required className="border border-navy-100 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-bronze-500" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="file" className="font-medium text-navy-950">Cover Image</label>
        {coverImageUrl && (
          <img src={coverImageUrl} alt="Cover" className="w-32 h-32 object-cover rounded-sm mb-2" />
        )}
        <input type="file" id="file" name="file" accept="image/*" className="border border-navy-100 p-3 rounded-sm" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="font-medium text-navy-950">Content (Markdown/HTML)</label>
        <textarea id="content" name="content" defaultValue={project?.content} required rows={6} className="border border-navy-100 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-bronze-500" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={project?.isFeatured} className="w-4 h-4 accent-bronze-500" />
        <label htmlFor="isFeatured" className="font-medium text-navy-950">Featured Project</label>
      </div>

      <div className="pt-4 border-t border-navy-100 flex justify-end gap-4">
        <Button variant="secondary" type="button" onClick={() => router.back()} className="py-2 px-6">Cancel</Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="py-2 px-6">
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
