import React from "react";

export function TaskSection({
  title,
  description,
  icon,
  buttonText,
  onButtonClick,
  showImageInput = false,
  imageInputLabel = "Upload image",
  onImageChange,
  uploadedImage,
  outputText,
  loading = false,
}) {
  const isPrimitive = typeof outputText === "string" || typeof outputText === "number";
  const isElement = React.isValidElement(outputText);

  return (
    <div className="w-full h-full">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-custom-green dark:hover:border-custom-green shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
        <div className="relative p-8 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 text-custom-green group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700 transition-colors">
              {icon}
            </div>
            <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">{title}</h3>
          </div>

          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">{description}</p>

          {/* Output / Image Preview */}
          <div className="flex-1 mb-6 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 min-h-[120px] flex flex-col items-center justify-center p-2 text-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-custom-green border-t-transparent rounded-full animate-spin"></div>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Processing...</p>
              </div>
            ) : (
              <>
                {uploadedImage && (
                  <img src={uploadedImage} alt="Uploaded" className="max-h-32 object-contain mb-2 rounded-md" />
                )}

                {isPrimitive ? (
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm whitespace-pre-wrap px-2">
                    {outputText || "Output will appear here"}
                  </p>
                ) : isElement ? (
                  <div className="w-full px-2">{outputText}</div>
                ) : outputText ? (
                  <pre className="text-neutral-600 dark:text-neutral-300 text-sm whitespace-pre-wrap text-left max-h-48 overflow-auto p-2 w-full">
                    {JSON.stringify(outputText, null, 2)}
                  </pre>
                ) : (
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">Output will appear here</p>
                )}
              </>
            )}
          </div>

          {/* Image Upload */}
          {showImageInput && (
            <label className="mt-4 w-full text-left">
              <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{imageInputLabel}</span>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="mt-2 block w-full text-sm text-neutral-700 dark:text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-200 dark:file:bg-neutral-700 file:px-4 file:py-2 file:text-neutral-700 dark:file:text-neutral-300 hover:file:bg-neutral-300 dark:hover:file:bg-neutral-600 transition-colors"
              />
            </label>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={(e) => onButtonClick?.(e)}
            className="mt-4 w-full rounded-md bg-gradient-to-r from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] text-white font-medium py-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
