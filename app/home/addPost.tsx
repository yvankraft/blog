"use client";
import { useState } from "react";
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Image,
  Video,
  X,
} from "lucide-react";
import Modal from "../components/Modal";
import { createPostAction } from "@/app/lib/actions";

export default function addPost() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [editStep, setEditStep] = useState<"form" | "success" | "error">(
    "form",
  );
  const [errorMessage, setErrorMessage] = useState("");

  // États pour stocker les données du formulaire
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO" | null>(null);

  //gestion de telechargement des images ou videos
  const uploadFileToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // Le preset d'upload configuré dans Cloudinary pour les uploads non signés
    formData.append("upload_preset", "les_talk_preset");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData },
    );

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    return {
      url: data.secure_url,
      type:
        data.resource_type === "video"
          ? "VIDEO"
          : ("IMAGE" as "IMAGE" | "VIDEO"),
    };
  };

  //fonction d'ouverture de la modal de création de post
  const handleOpenEditModal = (type: "create" | "edit", postId?: string) => {
    setIsEditModalOpen(true);
    setEditStep("form");
    setErrorMessage("");
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditStep("form");

    try {
      // Appel de la Server Action avec toutes nos données (Texte + Liens Cloudinary)
      await createPostAction({
        title,
        content,
        mediaUrl,
        mediaType,
      });
      // Si tout s'est bien passé, on réinitialise l'interface
      setTitle("");
      setContent("");
      setMediaUrl(null);
      setMediaType(null);
      setEditStep("success"); // Affiche l'écran vert de succès
    } catch (err: any) {
      setErrorMessage(
        err.message || "Une erreur est survenue lors de la publication",
      );
      setEditStep("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleOpenEditModal("create")}
        className="fixed  btn-primary bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        create a post
        <PlusCircle size={24} />
      </button>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {editStep === "form" && (
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
            <h2 className="text-lg text-center font-bold">Create a new post</h2>
            <input
              type="text"
              placeholder="Title of your post (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent"
            />
            <textarea
              placeholder="What do you want to talk about? "
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent resize-none"
            />
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/20 text-center">
              {mediaUrl ? (
                <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center max-h-60">
                  {mediaType === "IMAGE" ? (
                    <img
                      src={mediaUrl}
                      alt="Aperçu"
                      className="w-full h-full object-contain max-h-60"
                    />
                  ) : (
                    <video
                      src={mediaUrl}
                      controls
                      className="w-full h-full object-contain max-h-60"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaUrl(null);
                      setMediaType(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  {/* Explorateur de fichier HTML masqué */}
                  <input
                    type="file"
                    id="gallery-upload"
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={uploadingMedia || loading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setUploadingMedia(true);
                      try {
                        const result = await uploadFileToCloudinary(file);
                        setMediaUrl(result.url);
                        setMediaType(result.type);
                      } catch (err: any) {
                        alert(
                          err.message || "Impossible de charger le fichier.",
                        );
                      } finally {
                        setUploadingMedia(false);
                      }
                    }}
                  />

                  {/* Déclencheur visuel stylisé */}
                  <label
                    htmlFor="gallery-upload"
                    className={`flex flex-col items-center justify-center gap-2 text-zinc-500 transition ${
                      uploadingMedia || loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-300"
                    }`}
                  >
                    <div className="flex gap-1.5 text-zinc-400">
                      <Image size={24} />
                      <Video size={24} />
                    </div>
                    <span className="text-xs font-medium">
                      {uploadingMedia
                        ? "Téléchargement en cours..."
                        : "Ajouter une photo ou une vidéo depuis votre galerie"}
                    </span>
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="text-xs font-medium px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md transition"
              >
                {loading ? "publish..." : "published"}
              </button>
            </div>
          </form>
        )}
        {editStep === "success" && (
          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <CheckCircle2 size={40} className="text-green-500" />
            <h2 className="text-lg font-bold dark:text-white">
              Creation Successful
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Your post has been created instantly."
            </p>

            <button
              onClick={() => setIsEditModalOpen(false)}
              className="mt-2 text-xs font-medium px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md transition"
            >
              Done
            </button>
          </div>
        )}{" "}
        {editStep === "error" && (
          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <AlertCircle size={40} className="text-red-500" />
            <h2 className="text-lg font-bold dark:text-white">
              Creation Failed
            </h2>
            <p className="text-sm text-red-500 max-w-sm bg-red-500/10 border border-red-500/20 p-2 rounded-lg font-mono text-xs">
              {errorMessage}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="text-xs px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs font-medium px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
