"use client";

// Reading this as: Executive commission dossier form for an elite branding agency, using high-contrast editorial inputs and tactile submission states.
// DESIGN_VARIANCE: 7
// MOTION_INTENSITY: 5
// VISUAL_DENSITY: 5

import { useState } from "react";
import { createProject, updateProject } from "@/app/actions/projects";
import { uploadImage } from "@/app/actions/upload";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Briefcase, Image as ImageIcon, Sparkles, Loader2, ArrowLeft, Zap, Film } from "lucide-react";
import { AdminPhotoManager } from "./AdminPhotoManager";
import { AdminVideoManager } from "./AdminVideoManager";

export default function ProjectForm({ project }: { project?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImage || "");
  const [content, setContent] = useState(project?.content || "");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<"cover" | "content">("cover");
  const [showVideoModal, setShowVideoModal] = useState(false);

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
        content: content,
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
    <div className="max-w-3xl space-y-6">
      <button 
        type="button" 
        onClick={() => router.back()} 
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-navy-600 hover:text-navy-950 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO ARCHIVE</span>
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-warm-50 p-8 md:p-10 rounded-2xl border border-navy-200/80 shadow-xl relative overflow-hidden">
        
        {/* Subtle top indicator */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy-950 via-bronze-500 to-navy-900" />

        <div className="flex items-center justify-between border-b border-navy-200/80 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-bronze-600 font-semibold block mb-1">
              {project ? "REVISION DOSSIER" : "NEW INITIALIZATION"}
            </span>
            <h2 className="text-h3 font-bold text-navy-950">
              {project ? `Edit: ${project.title}` : "Create Commission Exhibit"}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-navy-950 text-bronze-400 flex items-center justify-center shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider">
              Commission Title
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={project?.title} 
              placeholder="e.g. Lumina Global Branding"
              required 
              className="bg-white border border-navy-200/80 p-3.5 rounded-xl text-sm font-medium focus:outline-none focus:border-bronze-500 transition-colors shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider">
              Routing Slug
            </label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={project?.slug} 
              placeholder="e.g. lumina-global"
              required 
              className="bg-white border border-navy-200/80 p-3.5 rounded-xl text-sm font-mono focus:outline-none focus:border-bronze-500 transition-colors shadow-sm" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider">
              Discipline Category
            </label>
            <input 
              type="text" 
              id="category" 
              name="category" 
              defaultValue={project?.category} 
              placeholder="e.g. Brand Strategy & Identity"
              required 
              className="bg-white border border-navy-200/80 p-3.5 rounded-xl text-sm font-medium focus:outline-none focus:border-bronze-500 transition-colors shadow-sm" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="year" className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider">
              Exhibition Year
            </label>
            <input 
              type="text" 
              id="year" 
              name="year" 
              defaultValue={project?.year || "2024"} 
              required 
              className="bg-white border border-navy-200/80 p-3.5 rounded-xl text-sm font-mono focus:outline-none focus:border-bronze-500 transition-colors shadow-sm" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 rounded-xl bg-warm-100/60 border border-navy-200/60">
          <div className="flex items-center justify-between">
            <label htmlFor="file" className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-bronze-700" />
              <span>Exhibition Cover Photography (16:9 Recommended)</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setPhotoTarget("cover");
                setShowPhotoModal(true);
              }}
              className="px-3 py-1.5 bg-navy-950 hover:bg-navy-900 text-bronze-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ SELECT FROM CLOUD PIPELINE</span>
            </button>
          </div>
          {coverImageUrl && (
            <div className="relative rounded-lg overflow-hidden border border-navy-200 w-full max-w-sm aspect-video bg-navy-950 mb-2 shadow-inner">
              <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <input 
            type="file" 
            id="file" 
            name="file" 
            accept="image/*" 
            className="text-xs font-mono text-navy-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-navy-950 file:text-warm-50 hover:file:bg-navy-900 transition-all cursor-pointer" 
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="content" className="text-xs font-mono font-bold text-navy-800 uppercase tracking-wider">
              Exhibition Overview &amp; Manifesto (Markdown / HTML)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhotoTarget("content");
                  setShowPhotoModal(true);
                }}
                className="px-2.5 py-1 bg-navy-950 hover:bg-navy-900 text-bronze-400 text-xs font-mono font-bold rounded flex items-center gap-1"
              >
                <span>🖼️ Insert Image Asset</span>
              </button>
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-2.5 py-1 bg-navy-950 hover:bg-navy-900 text-emerald-400 text-xs font-mono font-bold rounded flex items-center gap-1"
              >
                <Film className="w-3 h-3 text-emerald-400" />
                <span>🎬 Insert Video Asset</span>
              </button>
            </div>
          </div>
          <textarea 
            id="content" 
            name="content" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the comprehensive design manifesto and outcome metrics for this commission..."
            required 
            rows={8} 
            className="bg-white border border-navy-200/80 p-4 rounded-xl text-sm leading-relaxed focus:outline-none focus:border-bronze-500 transition-colors shadow-sm resize-none font-sans" 
          />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-navy-950 text-warm-50 border border-navy-800">
          <input 
            type="checkbox" 
            id="isFeatured" 
            name="isFeatured" 
            defaultChecked={project?.isFeatured} 
            className="w-5 h-5 rounded accent-bronze-500 cursor-pointer" 
          />
          <div className="flex flex-col">
            <label htmlFor="isFeatured" className="text-sm font-bold cursor-pointer flex items-center gap-1.5 text-warm-50">
              <Sparkles className="w-4 h-4 text-bronze-400" />
              <span>Feature on Homepage Exhibition Gallery</span>
            </label>
            <span className="text-xs text-navy-300">When checked, this commission renders prominently in the cinematic 16:9 gallery on `/work` and the homepage.</span>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-200/80 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="py-3 px-6 rounded-xl border border-navy-300 font-mono text-xs font-bold text-navy-700 hover:bg-navy-100 transition-all active:scale-[0.98]"
          >
            CANCEL
          </button>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="py-3 px-8 rounded-xl bg-navy-950 text-warm-50 font-mono text-xs font-bold hover:bg-navy-900 transition-all shadow-lg flex items-center gap-2 active:scale-[0.98]"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-bronze-400" />}
            <span>{project ? "UPDATE COMMISSION" : "INITIALIZE COMMISSION"}</span>
          </button>
        </div>
      </form>
      {/* Photo Pipeline Modal Overlay */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-[60] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border-2 border-bronze-500/40 rounded-3xl p-6 sm:p-10 max-w-7xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-8 text-warm-50">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-navy-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-bronze-400 font-black block mb-1">
                  ⚡ MODAL INJECTION PIPELINE / ASSET SELECTION
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Select Cloud Image Asset</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-red-950 text-warm-100 hover:text-red-300 border border-navy-700 hover:border-red-700 font-mono text-xs font-bold transition-all shadow-lg"
              >
                ✕ CLOSE PIPELINE
              </button>
            </div>
            <AdminPhotoManager
              isModal={true}
              onSelectPhoto={(url) => {
                if (photoTarget === "cover") {
                  setCoverImageUrl(url);
                } else {
                  const imgTag = `\n\n<p><img src="${url}" alt="Exhibition Asset" style="max-width: 100%; border-radius: 12px; margin: 24px 0;" /></p>\n\n`;
                  setContent((prev: string) => prev + imgTag);
                }
                setShowPhotoModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Video Pipeline Modal Overlay */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[60] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 max-w-7xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-8 text-warm-50">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-navy-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-black block mb-1">
                  ⚡ MODAL INJECTION PIPELINE / VIDEO SELECTION
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Select Cloud Video Asset</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-red-950 text-warm-100 hover:text-red-300 border border-navy-700 hover:border-red-700 font-mono text-xs font-bold transition-all shadow-lg"
              >
                ✕ CLOSE PIPELINE
              </button>
            </div>
            <AdminVideoManager
              isModal={true}
              onSelectVideo={(url) => {
                const videoTag = `\n\n<p><video src="${url}" controls style="max-width: 100%; border-radius: 12px; margin: 24px 0;"></video></p>\n\n`;
                setContent((prev: string) => prev + videoTag);
                setShowVideoModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
