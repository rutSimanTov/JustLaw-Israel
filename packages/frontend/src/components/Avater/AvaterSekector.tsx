import React, { useRef, useState } from "react"
import { Camera, X, Trash2, User } from "lucide-react"


const avatarOptions = [
  '/avatars/1.jpg',
  '/avatars/2.jpg',
  '/avatars/3.jpg',
  '/avatars/4.jpg',
  '/avatars/5.jpg',
  '/avatars/6.jpg',
  '/avatars/7.jpg',
  '/avatars/8.jpg',
  '/avatars/9.jpg',
]
export const AvatarSelector: React.FC<{
  previewUrl: string | null
  onImageSelected: (file: File) => void
  onAvatarSelected: (url: string) => void
  onClearImage?: () => void
}> = ({ previewUrl, onImageSelected, onAvatarSelected, onClearImage }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelected(file)
      setShowMenu(false)
    }
  }

  const handleAvatarSelect = (url: string) => {
    onAvatarSelected(url)
    setShowMenu(false)
  }

  return (
    <div className="relative space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-sky-300 shadow-md bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User color="black" size={64} />

          )}
        </div>

        {/* Camera Button */}
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="absolute bottom-0 right-0 bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-full shadow-md"
          aria-label="Open image options"
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Clear Button */}
        {previewUrl && onClearImage && (
          <button
            type="button"
            onClick={onClearImage}
            className="absolute top-0 left-0 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
            aria-label="Remove image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Menu */}
      {showMenu && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Choose an image</span>
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left px-4 py-2 text-sm text-sky-700 hover:bg-sky-50 rounded-md"
          >
            📁 Upload from computer
          </button>

          <div className="text-sm text-gray-500 mt-4 mb-2">Or choose an avatar:</div>

          <div className="grid grid-cols-4 gap-3 justify-items-center max-h-56 overflow-y-auto pr-1">
            {avatarOptions.map((url) => (
              <button
                key={url}
                onClick={() => handleAvatarSelect(url)}
                className="w-12 h-12 rounded-full overflow-hidden border hover:border-sky-500"
                aria-label="Select avatar"
              >
                <img
                  src={url}
                  alt="avatar option"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )
}